import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilsComponent } from '../../../components/utils/utils.component';
import { WarehouseMapsService } from '@suite/services';
import {validators} from "@suite/common-modules";

@Component({
  selector: 'suite-enable-lock-container',
  templateUrl: './enable-lock-container.component.html',
  styleUrls: ['./enable-lock-container.component.scss']
})
export class EnableLockContainerComponent implements OnInit {

  @ViewChild( UtilsComponent ) utils:UtilsComponent;

  warehouseId:number;

  /**The form group to register the data */
  form:FormGroup;

  constructor(private warehouseMapsService:WarehouseMapsService ,private formBuilder:FormBuilder,private modalController:ModalController,private navParams:NavParams) {
    this.warehouseId = this.navParams.get("warehouseId");
  }

  ngOnInit() {
    this.initFormBuilder();
    console.log(this.form);
  }

  initFormBuilder():void{
    this.form = this.formBuilder.group(
      {
        radio:['',[Validators.required]],
        rack_pattern:'',
        row_pattern:'',
        column_pattern:''
      },
      {
        validators: [
          validators.locationsPattern("rack_pattern"),
          validators.locationsPattern("row_pattern"),
          validators.locationsPattern("column_pattern"),
        ]
      }
    );
  }

  /**
   * Convert the option selected in the processType format required by the api
   * @param option - the option selected
   */
  assignStatus(option:number):{processTypeId:1|2,status:boolean}{
    /**the processId must be 1 or 2 depending of type, and their estatus can be active or inactive */
    return {processTypeId:option<3?1:2,status:1==option%2}
  }

  /**
   * clear empty values
   * @return sanitized object
   */
  sanitize(obj){
    let aux = JSON.parse(JSON.stringify(obj));
    Object.keys(aux).forEach(key=>{
      if(aux[key] === '')
        delete aux[key];
    });
    return aux; 
  }

  /**Close the current instance of the modal */
  close():void{
    this.modalController.dismiss();
  }

  /**send the form to the endpoint */
  submit():void{
    this.utils.presentLoading()
    let values = this.sanitize(this.form.value);
    values = {...values,...this.assignStatus(values.radio)}
    this.warehouseMapsService.configureLocation(this.warehouseId,values).subscribe(response=>{
      this.close();
      this.utils.dismissLoading();
      this.utils.presentAlert("Éxito","Configuración actualizada con éxito");
      console.log(response);
    });
    console.log(values);
  }
}
