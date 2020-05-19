import { Component, OnInit ,ViewChild} from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { DataComponent } from '../data/data.component';
import {SupplierConditionsService} from "../../../../../services/src/lib/endpoint/supplier-conditions/supplier-conditions.service";

@Component({
  selector: 'suite-supplier-condition-details',
  templateUrl: './supplier-condition-details.component.html',
  styleUrls: ['./supplier-condition-details.component.scss']
})
export class SupplierConditionDetailsComponent implements OnInit {

  title = 'Editar Condición de Proveedor';

  redirectTo = '/supplier-conditions';
  supplierCondition;

  constructor(
    private navParams:NavParams,
    private supplierConditionsService:SupplierConditionsService,
    private intermediaryService:IntermediaryService,
    private modalController:ModalController
  ) {
    this.supplierCondition = this.navParams.get("supplierCondition");
  }

  @ViewChild(DataComponent) data:DataComponent;

  ngOnInit() {
  }

  submit(value){
    this.intermediaryService.presentLoading();
    this.supplierConditionsService.update(this.supplierCondition.id, value).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Condición de proveedor actualizada con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error actualizando Condición de proveedor");
    })
  }

  close(){
    this.modalController.dismiss();
  }

}
