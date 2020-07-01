import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {JsonModalComponent} from "./json-modal/json-modal.component";
import {  ModelService } from '@suite/services';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { IntermediaryService } from '@suite/services';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';
import {AlertController, ModalController} from '@ionic/angular';

@Component({
  selector: 'status-onboarding',
  templateUrl: './status-onboarding.component.html',
  styleUrls: ['./status-onboarding.component.scss'],
})
export class StatusOnBoardingComponent implements OnInit {

  displayedColumns: string[] = ['reference', 'domain','variations','successfull', 'note','status', 'proccessing', 'processing_graph', 'actions'];
  dataSource: any;
  pagerValues: Array<number> = [10, 20, 50];

  constructor(
    private modelService: ModelService,
    private modalController: ModalController,
  ) {

  }

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  async ngOnInit() {

    this.loadDataAgain();
    this.listenChanges();
  }

  async loadDataAgain(){
    let data = {
      "pagination":{
        "page":1,
        "limit":10,
      }
    }
    await this.loadTableInfo(data);
  }

  async loadTableInfo(data){
    await this.modelService.getTableInfo(data).subscribe(values => {
      this.dataSource = values.results;
      const paginator = values.pagination;
      this.paginator.length = paginator.totalResults;
      this.paginator.pageIndex = paginator.selectPage;
      this.paginator.lastPage = paginator.lastPage;
    }, error=>{
      console.log("error", error)
    });
  }


  listenChanges() {
    /**detect changes in the paginator */
    this.paginator.page.subscribe(page => {
      let data = {
        "pagination":{
          "page":page.pageIndex,
          "limit":page.pageSize,
        }
      }
      this.loadTableInfo(data);
    });

  }

  async sizes(modelid){
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      componentProps: {
        modelId:modelid
      }
    });
    modal.present();
  }
  
  async json(model){
    const modal = await this.modalController.create({
      component: JsonModalComponent,
      componentProps: {
        model:model
      }
    });
    modal.present();
  }


  

}
