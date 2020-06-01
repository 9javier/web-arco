import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../data/data.component';
import { IntermediaryService } from '@suite/services';
import { SupplierConditionsService } from '../../../../../services/src/lib/endpoint/supplier-conditions/supplier-conditions.service';

@Component({
  selector: 'suite-supplier-condition-add',
  templateUrl: './supplier-condition-add.component.html',
  styleUrls: ['./supplier-condition-add.component.scss']
})
export class SupplierConditionAddComponent implements OnInit {

  @ViewChild(DataComponent) data:DataComponent;

  title = 'Crear Condición de Proveedor';
  redirectTo = '/supplier-conditions';
  selectProviders;

  constructor(
    private navParams:NavParams,
    private modalController:ModalController,
    private supplierConditionsService:SupplierConditionsService,
    private intermediaryService:IntermediaryService
  ) {
    this.selectProviders = this.navParams.get("selectProviders");
  }

  ngOnInit() {}

  submit(value){
    this.intermediaryService.presentLoading();
    this.supplierConditionsService.store(value).subscribe(data=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Condición de proveedor guardada con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error creando la condición de proveedor");
    })
  }

  close():void{
    this.modalController.dismiss();
  }
}
