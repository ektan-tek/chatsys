import { Component, OnInit, ElementRef,ViewChild,OnDestroy, Input } from "@angular/core";
//import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/switchMap";
import { Observable } from "rxjs/Rx";
import { RestapiService } from "../../@service/restapi.service";
import { ServerConfigService } from "../../@service/server-config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Http, Response, Headers } from "@angular/http";
class Clients {
  id: number;
  name: string;
}

@Component({
  selector: "app-client-chat",
  templateUrl: "./client-chat.component.html",
  styleUrls: ["./client-chat.component.scss"]
})
export class ClientChatComponent implements OnInit {
  form: FormGroup;

  loading: boolean = false;

  @ViewChild("fileInput") fileInput: ElementRef;
  /*
  customersObservable: Observable<Clients[]>;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.customersObservable = this.httpClient
    .get<Clients[]>("127.0.0.1:3000/clients");
    console.log(this.customersObservable);
  }
  constructor(
    private apiService: ApiService
    ) {
      this.apiService.getMessage().subscribe(
        data => {
          this.shelves = data["data"]; //status, data, message
          console.log(this.shelves);
        },
        err => {
          console.log(err);
        }
        );
        clients = [];
        constructor(private http:Http){}

        fetchData = function() {
          this.http.get("http://localhost:3000/clients").subscribe(
            (res:Response)=>{
              this.clients=res.json();
            }
            )

          }
          ngOnInit(): void {
            //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
            //Add 'implements OnInit' to the class.
            this.fetchData();
          }
          */

  @Input() clientsMsg: Observable<any>;
  @Input() server: Observable<any>;
  @Input() selectedRoles: string;

  poll_or_get: string;
  auto_notify;
  clients;
  sender = { id: 0, name: "-", block : true };
  receiver = { id: 0, name: "-", block: true};
  messageContent;

  constructor(
    private api: RestapiService,
    private data: ServerConfigService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ["", Validators.required],
      file_uploader: [null, Validators.required]
    });
  }
  ngOnInit() {
    this.data.curr_clients.subscribe(message => (this.clients = message));
    this.data.curr_poll_get.subscribe(message => (this.poll_or_get = message));
    this.data.curr_auto_notify.subscribe(message => (this.auto_notify = message));
  }


  onSelectSender(client) {
    this.messageContent = Observable.interval(1000)
      .startWith(0)
      .switchMap(() =>
        this.api.loadMessage(this.sender.id)
    );
    this.sender = client;
    this.data.curr_clients.subscribe(message => (this.clients = message));
  }
  onSelectReceiver(client) {
    this.receiver = client;
  }

/*------------------
 *  SEND MESSAGE
 -------------------*/
 onSendMsg(sender, receiver, msgContent) {
   if (msgContent.length == 0) {
     alert("Please input message");
    }
    else if (sender==receiver){
      alert("Sender cannot be the same as receiver");
    }
    else {
      this.api.sendMessage(sender, receiver, msgContent,this.auto_notify,this.poll_or_get,"msg");
    }
  }


  /*------------------
   *  SEND URL Links
   -------------------*/
 onSendUrl(sender, receiver, urlContent) {
   if (urlContent.length == 0) {
     alert("Please input url link");
    }
    else if (sender==receiver){
      alert("Sender cannot be the same as receiver");
    }
    else {
     var contentType = "oth";
     if ((urlContent.endsWith("jpg")) || (urlContent.endsWith("jpeg"))|| (urlContent.endsWith("png"))){
      contentType = "img";
     }
      this.api.sendMessage(sender,receiver,urlContent,this.auto_notify,this.poll_or_get,contentType);
    }
  }

  /*------------------
   *  GET button
   -------------------*/
   onGetMsg(sender) {
     this.api.getMessage(sender,"get");
    }
  /*------------------
   *  POLL button
  -------------------*/
  onPollMsg(sender) {
    this.api.getMessage(sender,"poll");

  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('file_uploader').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.split(',')[1]
        })
      };
    }

  }

  private prepareSave(): any {
    let input = new FormData();
    input.append("name", this.form.get("name").value);
    input.append("file", this.form.get("file_uploader").value);
    return input;
  }
  /*
  private prepareUpload(){
    let file = this.form.get("file_uploader").value;
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(file);
    this.loading = false;
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }*/



  onSubmit(sender,receiver) {
    //const formModel = this.prepareSave();

    const formModel = this.form.value;
    this.loading = true;
    // In a real-world app you'd have a http request / service call here like
    // this.http.post('apiUrl', formModel)
      this.loading = false;
      this.api.sendFile(sender, receiver,formModel);
      setTimeout(() => {
        // FormData cannot be inspected (see "Key difference"), hence no need to log it here
        alert("done!");
        this.loading = false;
      }, 1000);
    }

  clearFile() {
    this.form.get("file_uploader").setValue(null);
    this.fileInput.nativeElement.value = "";
  }

  getFiles(){

  }



}

