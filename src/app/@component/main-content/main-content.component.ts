import { Component, OnInit } from '@angular/core';
import { RestapiService } from "../../@service/restapi.service";
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  constructor(private api: RestapiService){}

  ngOnInit() {
  }


}
