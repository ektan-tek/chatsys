import { Component, OnInit } from '@angular/core';
import { ServerConfigService } from "../../@service/server-config.service";
@Component({
  selector: "app-selector",
  templateUrl: "./selector.component.html",
  styleUrls: ["./selector.component.scss"]
})
export class SelectorComponent implements OnInit {
  msgHandlers = [
    {name: "Use Get", value:"get",select:true},
    {name: "Use Poll", value:"poll",select:false}];
  clientMsgHandler = this.msgHandlers[0];
  poll_or_get: string; //get or poll
  autoNotify;

  constructor(private data: ServerConfigService) {}

  ngOnInit() {
    this.data.curr_poll_get.subscribe(poll_or_get => (this.poll_or_get = poll_or_get));
    this.data.curr_auto_notify.subscribe(auto_notify => (this.autoNotify = auto_notify));
  }
  onChangePollGet(selectedValue) {
    this.data.changePollGet(selectedValue);
  }
  onChangeNotify(disabledNotify) {
    this.data.changeNotify(disabledNotify);
  }
}
