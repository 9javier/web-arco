import { Component, OnInit } from '@angular/core';
import { AgencyService, AgencyModel, IntermediaryService } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { UpdateComponent } from './modals/update/update.component';
import { WarehousesService, WarehouseModel } from '@suite/services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

type select = {
  id:number;
  selected:boolean
}

@Component({
  selector: 'suite-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {

  public displayedColumns: string[] = ['select','name', 'address', 'phone'];

  dataSource:MatTableDataSource<AgencyModel.Agency>;
  selectForm:FormGroup = this.formBuilder.group({
    selecteds: new FormArray([])
  });
  agencies: AgencyModel.Agency[] = [];
  warehouses: WarehouseModel.Warehouse[] = [];
  toDeleteAgency: boolean = false;
  agenciesToDelete: number[] = [];

  constructor(
    private agencyService:AgencyService,
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private warehousesService: WarehousesService
  ) { }

  ngOnInit() {
    this.getAgencies();
    this.warehousesService.getIndex().then(observable=>{
      observable.subscribe(warehouses=>{
        this.warehouses = warehouses.body.data;
      });
    });
  }

  /**
   * Open modal to create new agency
   */
  async store():Promise<void>{
    let modal = (await this.modalController.create({
      component:StoreComponent
    }));
    modal.onDidDismiss().then(()=>{
      this.getAgencies();
    });
    modal.present();
  }

  /**
   * Open modal to update an agency
   */
  async update(agency:AgencyModel.Agency):Promise<void>{
    let modal = (await this.modalController.create({
      component:UpdateComponent,
      componentProps:{
        agency:agency
      }
    }));
    modal.onDidDismiss().then(()=>{
      this.getAgencies();
    })
    modal.present();
  }

  /**
   * Init a form to select each by each agency from array
   * @param agencies - a list of agencies
   */
  initSelectForm(agencies:AgencyModel.Agency[]){
    this.selectForm = this.formBuilder.group({
      selecteds: new FormArray([])
    });
    agencies.forEach(agency=>{
      (<FormArray>this.selectForm.get("selecteds")).push( this.formBuilder.group({
        id:agency.id,
        selected:false
      }))
    });
  }

  /**
   * determine if an array of objects have selected items
   */
  selecteds(selecteds:select[]):Array<number>{
    let aux = (selecteds.filter(selected=>{
      return selected.selected
    })).map(selected=>{
      return selected.id;
    })
    return aux.length?aux:null;
  }

  /**
   * Stop the usual behaviour of an event and stop it propagation
   * @param event 
   */
  prevent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  getAgencies():void{
    this.intermediaryService.presentLoading();
    this.agencyService.getAll().subscribe(agencies=>{
      this.agencies = agencies;
      this.intermediaryService.dismissLoading();
    });
  }

  assignToAgency(warehouse, agency) {
    this.warehousesService
    .toAgency(Number(warehouse.id), Number(agency.id))
    .then((data: Observable<HttpResponse<AgencyModel.Agency>>) => {
      data.subscribe(
        (res: HttpResponse<AgencyModel.Agency>) => {
          this.intermediaryService.presentToastSuccess("Warehouse añadido a la Agencia");
          let warehouseToUpdate = (<any>res.body).data;
          this.updateAgency(warehouseToUpdate, true);
        },
        (errorResponse: HttpErrorResponse) => {
          this.intermediaryService.presentToastError("Error al añadir el warehouse");
        }
      );
    });
  }

  removeToAgency(warehouse, agency) {
    this.warehousesService
    .removeOfAgency(Number(warehouse.id), Number(agency.id))
    .then((data: Observable<HttpResponse<WarehouseModel.ResponseDelete>>) => {
      data.subscribe(
        (res: HttpResponse<WarehouseModel.ResponseDelete>) => {
          this.intermediaryService.presentToastSuccess("Warehouse removido a la Agencia");
          let warehouseToUpdate = (<any>res.body).data;
          this.updateAgency(warehouseToUpdate, false);
        },
        (errorResponse: HttpErrorResponse) => {
          this.intermediaryService.presentToastError("Error al remover el warehouse");
        }
      );
    });
  }

  updateAgency(warehouseToUpdate, action: boolean): void {
    this.agencies.forEach(agency => {
      if(action) {
        if(warehouseToUpdate.manageAgencyId.id === agency.id) {
          agency.warehouses.push(warehouseToUpdate);
        }
      } else {
        let warehosuesAgency = agency.warehouses.filter(warehouse => warehouse.id !== warehouseToUpdate.id);
        agency.warehouses = warehosuesAgency;
      }
    })
  }

   /**
   * Activate delete button
   */
  activateDelete(id: number) {
    this.toDeleteAgency = true;
    let exits: boolean = this.agenciesToDelete.some(agencyId => agencyId === id);
    if(!exits) {
      this.agenciesToDelete.push(id);
    } else {
      this.agenciesToDelete.splice( this.agenciesToDelete.indexOf(id), 1 );
    }
    if(this.agenciesToDelete.length === 0) {
      this.toDeleteAgency = false;
    }
  }
    /**
   * Delete agency
   */
  deleteAgency() {
    let deletions:Observable<any> =new Observable(observer=>observer.next());
    this.agenciesToDelete.forEach(groupId => {
      deletions = deletions.pipe(switchMap(() => { 
        return (this.agencyService.delete(groupId))
      }))
    })

    this.agenciesToDelete = [];
    this.intermediaryService.presentLoading();

    deletions.subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.getAgencies();
      this.intermediaryService.presentToastSuccess("Agencias eliminadas con exito");
    },()=>{
      this.intermediaryService.dismissLoading();
      this.getAgencies();
      this.intermediaryService.presentToastError("No se pudieron eliminar algunas de las agencias");
    });
   }

   selectCheck(warehouseId: number, agencyId: number): boolean {
     let checkValue = false;

    this.agencies.forEach(agency => {
      agency.warehouses.forEach(warehosue => {
        if(warehouseId === warehosue.id && agency.id === agencyId){
          checkValue = true;
        }
      })
    })
     return checkValue;
   }
}
