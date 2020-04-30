import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { FilterButtonComponent } from '../components/filter-button/filter-button.component';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiltersModel } from '../../../services/src/models/endpoints/filters';
import { IntermediaryService } from '@suite/services';
import { SelectionModel } from '@angular/cdk/collections';
import { OplTransportExpeditionService } from '../../../services/src/lib/endpoint/opl-transport-expedition/opl-transport-expedition.service';
import {CreateTransportComponent} from './create-transport/create-transport.component';
import {ModalController, AlertController, LoadingController} from '@ionic/angular';
import { response } from 'express';


@Component({
  selector: 'transports-expeditions',
  templateUrl: './transports-expeditions.component.html',
  styleUrls: ['./transports-expeditions.component.scss'],
})
export class TransportsExpeditionsComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select','id', 'name', 'reference', 'log_internal'];
  dataSource: MatTableDataSource<any>;
  pagerValues = [10, 20, 80];
  selection = new SelectionModel<any>(true, []);
  originalTableStatus: any[];
  columns = {};

  //@ViewChild('filterButtonExpedition') filterButtonExpedition: FilterButtonComponent;
  //@ViewChild('filterButtonBarcode') filterButtonBarcode: FilterButtonComponent;
  //@ViewChild('filterButtonDate') filterButtonDate: FilterButtonComponent;
  //@ViewChild('filterButtonWarehouse') filterButtonWarehouse: FilterButtonComponent;

  /*isFilteringExpedition: number = 0;
  isFilteringBarcode: number = 0;
  isFilteringDate: number = 0;
  isFilteringWarehouse: number = 0;

  expedition: Array<TagsInputOption> = [];
  barcode: Array<TagsInputOption> = [];
  date: Array<TagsInputOption> = [];
  warehouse: Array<TagsInputOption> = [];
  locked: Array<TagsInputOption> = [];

  entities;
  pauseListenFormChange: boolean;
  lastUsedFilter: string;
 

 */
form: FormGroup = this.formBuilder.group({
  name: [],
  reference: [],
  logistic_internal: [],
  pagination: this.formBuilder.group({
    page: 1,
    limit: this.pagerValues[0]
  }),
  orderby: this.formBuilder.group({
    type: 1,
    order: "asc"
  })
});

length: any;

  constructor(
    private opTransportService: OplTransportExpeditionService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private alertController: AlertController,
    private modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    this.getList(this.form);
    /*this.initEntity();
    this.initForm();
    this.getFilters();
    this.getList(this.form);
    this.listenChanges();*/
  }

  async getList(form?: FormGroup) {
    this.intermediaryService.presentLoading("Cargando Transportes...");
   await  this.opTransportService.getOpTransports().subscribe((resp: any) => {
        
           console.log(resp);
           this.intermediaryService.dismissLoading()
           this.dataSource = new MatTableDataSource<any>(resp);
           //this.originalTableStatus = JSON.parse(JSON.stringify(resp.statuses));
          /* const paginator = resp.pagination;
 
           this.paginator.length = paginator.totalResults;
           this.paginator.pageIndex = paginator.selectPage;
           this.paginator.lastPage = paginator.lastPage;
         */
 
         /*if (resp.filters) {
           resp.filters.forEach(element => {
             this.columns[element.name] = element.id;
           });
         }*/
       },
       async err => {
         await this.intermediaryService.dismissLoading()
       },
       async () => {
         await this.intermediaryService.dismissLoading()
       })
   }

   async newTransport(transport,update){
    let modal = (await this.modalCtrl.create({
      component: CreateTransportComponent,
      componentProps: {
        transport: transport,
        update: update
      }
    }));

    modal.onDidDismiss().then(() => {
      this.refresh();
    });

    modal.present();
   }
   

masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
}

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

checkboxLabel(row?): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}

log_internal(logInt){
  if(logInt == 1 || logInt == true){
    return "SI"
  }else{
  return "NO"
  }
}

createTransport(){
  let body=[];
  this.newTransport(body,false);
}
openRow(row){
  this.newTransport(row,true);
}
refresh(){
  this.getList(this.form);
  this.selection.clear();
} 
async delete(){
  console.log(this.selection.selected.length);
  if(this.selection.selected.length == 1){
    console.log(this.selection.selected);
    await this.deleteOneTransport(this.selection.selected[0].id);
  }else{
    this.selection.selected.forEach((element, index, array)=> {
      this.deleteTransport(element.id);
    });
    this.refresh();
  }


}

public async deleteTransport(id){
  this.intermediaryService.presentLoading("Eliminar Transportes...");
  await this.opTransportService.deleteTransport(id).subscribe((resp: any) => {
    this.intermediaryService.dismissLoading();
    this.intermediaryService.presentToastSuccess("Transportes borrados exitosamente");
    console.log(resp);
  },(error)=>{
    this.intermediaryService.presentToastError("No se puede borrar el transporte");
    this.intermediaryService.dismissLoading();
    console.log(error);
  });
}

public async deleteOneTransport(id){
  this.intermediaryService.presentLoading("Eliminar Transportes...");
  await this.opTransportService.deleteTransport(id).subscribe((resp: any) => {
    this.intermediaryService.dismissLoading();
    this.intermediaryService.presentToastSuccess("Transportes borrados exitosamente");
    console.log(resp);
    this.refresh();
  },(error)=>{
    this.intermediaryService.presentToastError("No se puede borrar el transporte");
    this.intermediaryService.dismissLoading();
    console.log(error);
  });
}

}
