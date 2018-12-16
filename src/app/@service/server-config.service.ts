import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ServerConfigService {
  private pollGetSource = new BehaviorSubject("get");
  private notifySource = new BehaviorSubject(true);
  private clientSource = new BehaviorSubject("");
  curr_clients = this.clientSource.asObservable();
  curr_poll_get = this.pollGetSource.asObservable();
  curr_auto_notify = this.notifySource.asObservable();

  constructor() {}

  changePollGet(poll_or_get) {
    this.pollGetSource.next(poll_or_get);
  }
  changeNotify(auto_notify) {
    this.notifySource.next(auto_notify);
  }
  changeClients(clientObj){
    this.clientSource.next(clientObj);
  }
}
