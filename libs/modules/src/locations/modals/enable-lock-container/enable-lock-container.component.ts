import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilsComponent } from '../../../components/utils/utils.component';
import { WarehouseMapsModel, WarehouseMapsService } from '@suite/services';

@Component({
  selector: 'suite-enable-lock-container',
  templateUrl: './enable-lock-container.component.html',
  styleUrls: ['./enable-lock-container.component.scss']
})
export class EnableLockContainerComponent implements OnInit {

  /**values for the select */
  columns:Array<number> = [];
  rows:Array<number> = [];

  @ViewChild( UtilsComponent ) utils:UtilsComponent;

  warehouseId:number;

  racks:Array<WarehouseMapsModel.Rack> = [];

  /**The form group to register the data */
  form:FormGroup = this.formBuilder.group({
    radio:['',[Validators.required]],
    hall:'',
    row:'',
    column:''
  });

  constructor(private warehouseMapsService:WarehouseMapsService ,private formBuilder:FormBuilder,private modalController:ModalController,private navParams:NavParams) {
    this.warehouseId = this.navParams.get("warehouseId");
  }

  ngOnInit() {
    this.changeSelectOptions();
    this.getRacks(this.warehouseId);
    console.log(this.form);
  }

  /**
   * Change select options depends of rack value, and reset the values
   */
  changeSelectOptions():void{
    this.form.get("hall").valueChanges.subscribe(value=>{
      this.form.get("row").setValue('');
      this.form.get('column').setValue('');
      this.columns = [];
      this.rows = [];
      let rack = this.racks.find(rack=>rack.id==value);
      for(let i = 1;i<=rack.columns;i++)
        this.columns.push(i);
      for(let i = 1; i<= rack.rows;i++)
        this.rows.push(i);
    })
  }

  /**
   * Convert the option selected in the processType format required by the api
   * @param option - the option selected
   */
  assignStatus(option:number):{processTypeId:1|2,status:boolean}{
    /**the processId must be 1 or 2 depending of type, and their estatus can be active or inactive */
    return {processTypeId:option<3?1:2,status:1==option%2}
  }

  getRacks(id:number):void{
    this.warehouseMapsService.getWarehousesRacks(id).subscribe(racks=>{
      this.racks = racks;
    })
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