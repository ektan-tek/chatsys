import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit {
  clientMsgHandler: string;
  msgHandlers: string[] = ['Use Get', 'Use Poll'];
  constructor() { }

  ngOnInit() {
  }

}
