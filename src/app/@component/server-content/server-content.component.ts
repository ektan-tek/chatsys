import { Component, OnInit, Input } from '@angular/core';
import "rxjs/add/observable/interval";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/switchMap";
import { Observable } from "rxjs/Rx";
import { RestapiService } from "../../@service/restapi.service";
import { ServerConfigService } from "../../@service/server-config.service";

@Component({
  selector: "app-server-content",
  templateUrl: "./server-content.component.html",
  styleUrls: ["./server-content.component.scss"]
})
export class ServerContentComponent implements OnInit {
  @Input() clients: Observable<any>;
  @Input() queueContents: Observable<any>;
  @Input() queueActions: Observable<any>;
  constructor(private api: RestapiService, private data: ServerConfigService) {}

  ngOnInit() {
    this.clients = Observable.interval(1000)
      .startWith(0)
      .switchMap(() => this.api.getClients());
    this.queueContents = Observable.interval(1000)
      .startWith(0)
      .switchMap(() => this.api.getQueueContent());
    this.queueActions = Observable.interval(1000)
      .startWith(0)
      .switchMap(() => this.api.getQueueActions());
  }

  onClearQueue(){
    this.api.deleteAllContents();
  }
  onClearAction(){
    this.api.deleteAllActions();
  }
  onNotify(){
    this.api.notifyAll();
  }
}
