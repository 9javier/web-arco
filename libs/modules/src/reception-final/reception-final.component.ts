import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {  MatSort, Sort ,MatTableDataSource, MatCheckboxChange } from '@angular/material';
import receprionFinal = ReceptionFinalModel.receptionFinalData;
import { IntermediaryService } from '../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import * as Filesave from 'file-saver';
import { catchError } from 'rxjs/operators';
import { from, Observable } from "rxjs";
import { of } from 'rxjs';
import { ModalController} from '@ionic/angular';
import { ModalReceptionFinalComponent } from "../components/modal-reception-final/modal-reception-final.component";
import { ReceptionFinalService } from '../../../services/src/lib/endpoint/reception-final/reception-final.service';
import { ReceptionFinalModel } from 'libs/services/src/models/endpoints/reception-final';


import {
  NewProductsService,
  UserTimeModel
} from '@suite/services';
import { Router } from '@angular/router';
import * as _ from "lodash";

@Component({
  selector: 'reception-final',
  templateUrl: './reception-final.component.html',
  styleUrls: ['./reception-final.component.scss']
})
export class ReceptionFinalComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  //displayedColumns: string[] = ['select','references','sizes','warehouses','date_service','brands','providers','models','colors','category','family','lifestyle'];
  
  //displayedColumns: string[] = ['select','Warehouses'];
  displayedColumns: string[] = ['select','Warehouses','reception'];
  
  
  selection = new SelectionModel<receprionFinal>(true, []);
  selectionReception = new SelectionModel<receprionFinal>(true, []);
  selectionPredistribution = new SelectionModel<receprionFinal>(true, []);
  //selectionReserved = new SelectionModel<Predistribution>(true, []);
  columns = {};
  pagerValues = [10, 20, 80];
  

  dataSource
  

  
  constructor(
    private predistributionsService: PredistributionsService,
    private receptioFinalService: ReceptionFinalService,
    private newProductsService: NewProductsService,
    private formBuilder: FormBuilder,
    private formBuilderExcell: FormBuilder,
    private intermediaryService:IntermediaryService,
    private modalController: ModalController,
  ) {}

  ngOnInit(): void {
    //this.initEntity();
    //this.initForm();
    //this.getFilters();
    //this.getColumns(this.form);
    this.getList();
  }


 

  close():void{
  }


  getListReceptions(){
    let receptionList =[];
        receptionList.length=0;
       for(let i=0; i<this.selection.selected.length; i++){
        // let distribution =JSON.stringify(this.selection.selected[i].distribution);
         //let reserved =JSON.stringify(this.selection.selected[i].reserved);
         let idReception = JSON.stringify(this.selection.selected[i].id);
         let warehouseId = JSON.stringify(this.selection.selected[i].warehouseId.id);
         let reference = this.selection.selected[i].warehouseId.reference;
         let name = reference + ' '+this.selection.selected[i].warehouseId.name;
           receptionList.push({
          id: idReception,
           warehouseId: warehouseId,
           name: name,

         });

       }


       return receptionList;
  }

  isEnableSend(): boolean{
    
    let ListReceptions = this.getListReceptions();
    if(ListReceptions.length>0){
      return true
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  async getList(){

    this.intermediaryService.presentLoading("Cargando Reception Final...");
    this.receptioFinalService.getIndex().subscribe((resp:any) => {
      this.intermediaryService.dismissLoading();
      if (resp) {
      
        this.dataSource = new MatTableDataSource<ReceptionFinalModel.receptionFinal>(resp);
        //const paginator = resp.pagination;

        /*this.paginator.length = paginator.totalResults;
        this.paginator.pageIndex = paginator.selectPage;
        this.paginator.lastPage = paginator.lastPage;*/
        //this.selectionPredistribution.clear();
        //this.selectionReserved.clear();
        this.selectionReception.clear();

        this.dataSource.data.forEach(row => {
          if (row.receptionFinal == true) {
            this.selectionReception.select(row);
          }
         
        });
      }
    },
    async err => {
      await this.intermediaryService.dismissLoading()
    },
    async () => {
      await this.intermediaryService.dismissLoading()
    })
   
  }

  delete(){
    let ListReceptions = this.getListReceptions();
    this.presentModalDelete(ListReceptions);
  }
  

  save(){
    this.presentModal();
  }

    async presentModal() {
      const modalType=1;
      const modal = await this.modalController.create({
        component: ModalReceptionFinalComponent,
        componentProps: {
          modalType
        }
      })
      modal.onDidDismiss().then(() => {
          this.selection.clear();
          this.getList();
      });;

      return await modal.present();

  }

  async presentModalDelete(ListReceptions) {
    const modalType=2;
    const modal = await this.modalController.create({
      component: ModalReceptionFinalComponent,
      componentProps: {
        ListReceptions,
        modalType
      }
    })
    modal.onDidDismiss().then(() => {
        this.selection.clear();
        this.getList();
    });;

    return await modal.present();

}

async presentModalUpdate(whUpdate) {
  const modalType=3;
  const modal = await this.modalController.create({
    component: ModalReceptionFinalComponent,
    componentProps: {
      modalType,
      whUpdate
    }
  })
  modal.onDidDismiss().then(() => {
      this.selection.clear();
      this.getList();
  });;

  return await modal.present();

}


edit(id,idWh, warehouse){
  let whUpdate=[];
  let object = {
    id: id,
    idWh: idWh,
    name: warehouse
  };
  whUpdate.push(object);
 this.presentModalUpdate(whUpdate);
}

  reservedToggle() {

    if (this.isAllSelectedReserved()) {
      this.dataSource.data.forEach(row => {
        row.reserved = false;
      });
      this.selectionReception.clear();
    } else {
      this.dataSource.data.forEach(row => {
        row.reserved = true;
        this.selectionReception.select(row);
      });
    }
  }

  isAllSelectedReserved() {
    if (this.dataSource) {
      const numSelected = this.selectionReception.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    return false
  }

}
