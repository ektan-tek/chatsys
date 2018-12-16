import { Injectable } from "@angular/core";
import {   HttpRequest, HttpEvent } from '@angular/common/http';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { HttpParams } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};
class Client {
  id: number;
  name: string;
  online: boolean;
  status: string;
  block: boolean;
}

@Injectable({
  providedIn: "root"
})
export class RestapiService {
  SERVER_URL = "http://127.0.0.1:3000/";
  SERVER_URL2 = "http://127.0.0.1:4200/assets/";
  clientData: any;
  msgContent: any;
  notifyRec: any;
  tempdata: any;
  constructor(private http: HttpClient) {}
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  //Standard POST API
  standardAPI_POST(target_data, content, post_desc) {
    this.http.post(this.SERVER_URL + target_data, content).subscribe(
      data => {
        console.log("Successful POST - " + post_desc, data);
      },
      error => {
        console.log("POST Error - " + post_desc, error);
      }
    );
  }

  filterClient(clientList, id) {
    return clientList.find(e => e.id === id);
  }

  standardAPI_GET(target_data) {
    return this.http.get(this.SERVER_URL + target_data).map(result => result);
  }
  /*
  getFile(){
    return this.http.get(filename, { responseType: 'text' })
      .pipe(
        tap( // Log the result or error
          data => this.log(filename, data),
          error => this.logError(filename, error)
        )
      );
  }
  download() {
    this.downloaderService.getTextFile('assets/textfile.txt')
      .subscribe(results => this.contents = results);
  }
*/
  standardAPI_singleDELETE(target_data, id) {
    this.http.delete(this.SERVER_URL + target_data + "/" + id).subscribe(
      data => {
        console.log("DELETE Request is successful ", data);
      },
      error => {
        console.log("Error", error);
      }
    );
  }

  standardAPI_singleUPDATE(target_data, id, content) {
    this.http.patch(this.SERVER_URL + target_data + "/" + id, content)
      .subscribe(
        data => {
          console.log("PATCH Request is successful ", data);
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  standardAPI_UPDATE_DELETE(target_data, id, content, process) {
    this.standardAPI_GET(target_data + id).subscribe((data: any[]) => {
      if (data.length > 1) {
        data.forEach(element => {
          if (process == "update") {
            this.standardAPI_singleUPDATE(target_data, element.id, content);
          } else {
            this.standardAPI_singleDELETE(target_data, element.id);
          }
        });
      } else {
        if (process == "update") {
          this.standardAPI_singleUPDATE(target_data,data[0].id, content);
        } else {
          this.standardAPI_singleDELETE(target_data,data[0].id);
        }
      }
    });
  }

  /*
  APPLICATION USAGE
  */
  //CLIENT RELATED
  getClients() {
    return this.standardAPI_GET("clients");
  }

  //TODO
  getClient(id){
    return this.standardAPI_GET("clients/"+id);
  }

  addClient(names) {
    this.clientData = { name: names, online: true,block:false };
    this.standardAPI_POST("clients", this.clientData, "addClient");
  }

  changeClientStatus(id, status) {
    this.clientData = { id: id, online: status,block:false };
    this.standardAPI_singleUPDATE("clients",id,this.clientData);
  }

  changeBlocking(id, block) {
    this.clientData = { id: id, block: block };
    this.standardAPI_singleUPDATE("clients", id, this.clientData);
  }

  //Queue Related
  getQueueContent() {
    return this.standardAPI_GET("queue_content");
  }

  getQueueActions() {
    return this.standardAPI_GET("queue_act");
  }

  deleteAllContents() {
    return this.standardAPI_UPDATE_DELETE("queue_content","?id>0", "","delete");
  }

  deleteAllActions() {
    return this.standardAPI_UPDATE_DELETE("queue_act", "?id>0", "", "delete");
  }


  loadMessage(clientID) {
      return this.standardAPI_GET("queue_content?to="+clientID+"&send=true");
  }

  notifyAll(){
    //Check whether queue has message
    var msg_id;
    this.standardAPI_GET("queue_content?send=false&_sort=id").subscribe(
     (data: any) => {
        if (data.length >= 1) {
          data.forEach(element => {
            this.standardAPI_GET("clients/" + element.to).subscribe(
              (data2: any) => {
                if (data2.online) {
                  //Client is online
                  this.standardAPI_singleUPDATE(
                    "queue_content",
                    element.id,
                    {
                      send: true
                    }
                  );
                  this.notifyRec = {
                    action: "notify",
                    client: data2.id,
                    msg: "Client is online, Remove Msg from Q"
                  };
                  //Check block - if block : Unblocked
                  if (data2.block) {
                    this.standardAPI_POST(
                      "queue_act",
                      this.notifyRec,
                      "Record"
                    ); //Post prev msg
                    this.clientData = { block: false };
                    this.standardAPI_singleUPDATE(
                      "clients",
                      data2.id,
                      this.clientData
                    );

                    this.notifyRec = {
                      action: "unblocked client",
                      client: data2.id,
                      msg: "Client has received message"
                    };
                  }
                } else {
                  //client is offline
                  this.notifyRec = {
                    action: "notify",
                    client: data2.id,
                    msg: "Client is offline-Msg stays"
                  };
                }
                this.standardAPI_POST(
                  "queue_act",
                  this.notifyRec,
                  "Record"
                );
              }
            );
          });
        } //END has message
        else {
          alert("No message in queue!");
        }
      }
    );
  }
  /* ==========================
  *    GET & POLL Implementation
  =========================*/
  getMessage(clientID, poll_or_get) {
    // 1)  First check whether user is blocked
    return this.standardAPI_GET("clients?id=" + clientID).subscribe(
      (data: any) => {
        if (!data[0].online) {
         // User get alert message - USER OFFLINE
          alert("Client"+clientID+" is currently offline!");
        }
        else if (data[0].block) {
          //User get alert message
          alert("Client"+clientID+" has been blocked!");
        }
        else{
          //Prepare record
          this.notifyRec = { action: poll_or_get, client: clientID, msg: "Client ask "+poll_or_get+", Remove Msg from Q" };

          //Check how many messages in queue
          this.standardAPI_GET("queue_content?to="+clientID+"&send=false").subscribe(
           (data2: any)=> {
            if (data2.length >= 1) {
              data2.forEach(element => {
                this.standardAPI_singleUPDATE("queue_content", element.id, {"send":true});
              });
              this.clientData = { "block":false };
              this.notifyRec = { action: poll_or_get, client: clientID, msg: poll_or_get+" Msg. Remove Msg from Q"};
            } else {
              this.notifyRec = { action: poll_or_get, client: clientID, msg: poll_or_get+" Msg. No Message"};
              this.clientData = { "block":false };
              if (poll_or_get=="get"){
                this.standardAPI_POST("queue_act", this.notifyRec, "Record");
                this.notifyRec = { action: poll_or_get, client: clientID, msg: poll_or_get+"blocks. Client is blocked"};
                this.clientData = { "block":true };
              }
            }

            this.standardAPI_POST("queue_act", this.notifyRec, "Record");
            this.standardAPI_singleUPDATE("clients",clientID,this.clientData);
          });
        } // End not blocking
      });
      //var msgList = this.standardAPI_GET("queue_content?to=" + clientID, "");
        //return msgList;
      }


  /*=======================
   *   SEND MESSAGE HANDLER
   ========================*/
  sendMessage(senderID, receiverID, msgContent, notify, poll_or_get,msgType) {
    //Check whether sender is blocking
    this.standardAPI_GET("clients?id=" + senderID).subscribe(
      (data: any) => {
        if (!data[0].online) {
          //User get alert message - USER OFFLINE
          alert("Client" + senderID + " is currently offline!");
        }
        else if (data[0].block) {
          alert("Client"+senderID+" has been blocked!");
        }
        else{

          //Prepare Message content
          this.msgContent = {from: senderID,to: receiverID,content: msgContent,type: msgType,send: false};

          //PUT to server
          this.standardAPI_POST("queue_content", this.msgContent, "MsgContent");
          this.notifyRec = { action: "put", client: receiverID,msg:"Put into Queue - "+msgType };
          this.standardAPI_POST("queue_act", this.notifyRec, "Record");

          //Notify checks - Execute if auto notify
          if (notify) {
            //Notify - Records
            this.notifyRec = { action: "auto-notify", client: receiverID,msg:"Queue notify client" };
            this.standardAPI_POST("queue_act", this.notifyRec, "Record");
          } //END AUTO NOTIFY


          //Check online, bloking of RECEIVER
          this.standardAPI_GET("clients?id=" + receiverID).subscribe(
            (data: any) => {
              if (!data[0].online) {  //Receiver is offline
                //Notify - Failed
                if (notify){
                  this.notifyRec = { action: "notify-failed", client: receiverID,msg:"Client is offline" };
                this.standardAPI_POST("queue_act", this.notifyRec, "Record");
              }
            }  //End receiver is offline - notify / send
            else {  //Receiver is online

              //CLient is online - blocking / auto notify
              if ((data[0].block) || (notify)){
                //Change to send : Means the message is viewable by receiver now : BULK UPDATE
                this.standardAPI_UPDATE_DELETE(
                  "queue_content",
                  "?to=" + receiverID,
                  { send: true },
                  "update"
                  );

                  //Prepare Records - Update that msg is sent
                  var curr_msg = "Successful rec - ";
                  var curr_action ="rec msg";
                  //Notify :Sucesss - get or poll
                  if(notify){
                    curr_msg = "Auto "+poll_or_get;
                    curr_action = poll_or_get;
                  }
                this.notifyRec = { action: curr_action, client: receiverID, msg: curr_msg+", Remove Msg from Q"};
                this.standardAPI_POST("queue_act", this.notifyRec, "Record");


                //unblocked - if currently blocking
                  if (data[0].block){
                    this.clientData = { "block": false };
                    this.standardAPI_singleUPDATE(
                      "clients",
                      receiverID,
                      this.clientData
                      );

                      this.notifyRec = { action: "unblocked client", client: receiverID,msg:"Client has received message" };
                      this.standardAPI_POST("queue_act", this.notifyRec, "Record");
                    }
                  }//end auto notify / blocking for persistent get

                } // Receiver is online - send message

            }); //Use to check RECEIVER online /offline



            /*
            this.standardAPI_GET("clients", receiverID).subscribe((data) => {
              console.log(data);
              if (data.online){
                //Notify
                this.notifyRec = { action: "notify", client: receiverID };
                this.standardAPI_POST("queue_act", this.notifyRec, "Record");
              }


            });
            this.standardAPI_UPDATE("clients", receiverID, this.clientData);
            */


           //return this.http.post('http://localhost:3000/clients', this.client);
          }
        });
      }//End send Message

      sendFile(senderID,receiverID,formData){
        //Prepare Message content
        console.log(formData);
        //Prepare Message content
        this.msgContent = { from: senderID, to: receiverID, content: formData, type: "file", send: false };
        //PUT to server
        this.standardAPI_POST("queue_content", this.msgContent, "MsgContent");
        this.notifyRec = { action: "put", client: receiverID, msg: "Put into Queue - FILE" };
        this.standardAPI_POST("queue_act", this.notifyRec, "Record");

        alert("DATA");
        /*
        this.msgContent = {from: senderID,to: receiverID,content: formData,type: "file",send: false};
        this.standardAPI_POST("queue_content", this.msgContent, "Record");
        this.http.post("path", formData).subscribe(
          (r) => { console.log('got r', r) }
          )
        }
        */
      }



  }
