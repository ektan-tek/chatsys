import { Component, OnInit, OnDestroy, Input } from "@angular/core";
//import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { RestapiService } from "../../@service/restapi.service";
import { ServerConfigService } from "../../@service/server-config.service";

@Component({
  selector: "app-manage-client",
  templateUrl: "./manage-client.component.html",
  styleUrls: ["./manage-client.component.scss"]
})
export class ManageClientComponent implements OnInit {
  @Input() clients: Observable<any>;
  @Input() server: Observable<any>;
  poll_or_get: string;
  auto_notify;
  latestClientValue :any[];
  constructor(private api: RestapiService, private data: ServerConfigService) {}
  ngOnInit() {
    this.clients = Observable.interval(1000)
      .startWith(0)
      .switchMap(() => this.api.getClients());
    this.data.curr_poll_get.subscribe(message => (this.poll_or_get = message));
    this.data.curr_auto_notify.subscribe(message => (this.auto_notify = message));
    this.changeClientData();
  }
  onRefresh(){
    this.clients = this.api.getClients();
  }
  addUsers(names) {
    this.api.addClient("client"+names);
    this.changeClientData();
  }

  changeClientStatus(id, status) {
    this.api.changeClientStatus(id, !status);
    this.changeClientData();
  }
  changeBlocking(id, block) {
    this.api.changeBlocking(id, !block);
    this.changeClientData();
  }
  changeClientData() {
    this.data.changeClients(this.api.getClients());
  }
}
