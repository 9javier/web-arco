import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ModelService
} from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import {AlertController, ModalController} from '@ionic/angular';
import {InfoModalComponent} from "./info-modal/info-modal.component";
import { PaginatorComponent } from '../components/paginator/paginator.component';

@Component({
  selector: 'suite-marketplaces',
  templateUrl: './marketplaces.component.html',
  styleUrls: ['./marketplaces.component.scss']
})
export class MarketplacesComponent implements OnInit {

  displayedColumns: string[] = ['reference', 'domain','variations','successfull', 'note','status', 'actions'];
  dataSource: any;
  pagerValues: Array<number> = [10, 20, 50];

  constructor(
    private modelService: ModelService,
    private modalController: ModalController,
  ) {

  }

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  async ngOnInit() {

    let data = {
      "pagination":{
        "page":1,
        "limit":10,
      }
    }
    await this.loadTableInfo(data);
    this.listenChanges();
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

  async test(modelid){
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      componentProps: {
        modelId:modelid
      }
    });

    modal.present();
  }

  

}
