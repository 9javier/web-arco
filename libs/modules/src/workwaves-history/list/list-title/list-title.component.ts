import { Component, OnInit } from '@angular/core';
import {ListWorkwavesHistoryComponent} from "../list.component";
import { IntermediaryService } from '@suite/services';




@Component({
  selector: 'title-list-workwaves-history',
  templateUrl: './list-title.component.html',
  styleUrls: ['./list-title.component.scss']
})
export class TitleListWorkwavesHistoryComponent implements OnInit {

  constructor(private listWorkwavesHistoryComponent: ListWorkwavesHistoryComponent,
  private intermediaryService: IntermediaryService){}

  ngOnInit() {}

  loadWorkWave(){
    this.intermediaryService.presentLoading("Refrescando listado");
    const response = this.listWorkwavesHistoryComponent.loadWorkwavesTemplates();
    this.intermediaryService.dismissLoading();
    return response;
  }
}
