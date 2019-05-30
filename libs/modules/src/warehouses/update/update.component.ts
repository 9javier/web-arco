import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from "@ionic/angular";
import { WarehousesService,WarehouseGroupService,WarehouseGroupModel } from '@suite/services';
import { UtilsComponent } from '../../components/utils/utils.component';


@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  @ViewChild(UtilsComponent) utils:UtilsComponent;
  updateForm:FormGroup = this.formBuilder.group({
    id:['',[Validators.required]],
    name: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', Validators.required],
    reference: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    is_store: [false, []],
    groupId:'',
    is_main: [false, []],
    has_racks: [false, []],
    halls:'',
    rows:'',
    columns:''
  });
  private warehouseId;

  groups:Array<WarehouseGroupModel.WarehouseGroup>=[]
  constructor(private modalCtrl:ModalController,
    private formBuilder:FormBuilder,
    private warehousesService:WarehousesService,
    private warehouseGroupService:WarehouseGroupService,
    private cd: ChangeDetectorRef,
    private navParams:NavParams,
    ) {
      this.warehouseId = this.navParams.data.id;
      this.getWarehouse(this.warehouseId);
      
    }

  /**
  * Assign and unassign validators depends of value of another validators
  */
  changeValidatorsAndValues():void{
    let values = this.updateForm.value;
    /**Listen for changes on is_store control */
    this.updateForm.get("is_store").valueChanges.subscribe((isStore)=>{
      let store = this.updateForm.get("groupId")
      store.clearValidators();
      store.setValue("");
      this.cd.detectChanges();
    });
    /**Listen for changes in has_racks control */
    this.updateForm.get("has_racks").valueChanges.subscribe((hasRacks)=>{
      let hallways = this.updateForm.get("halls");
      let rows = this.updateForm.get("rows")
      let columns = this.updateForm.get("columns")
      let aux = [hallways,rows,columns].forEach(control=>{
        control.clearValidators();
        control.setValue("");
        control.setValidators(control?[Validators.required]:[]);
      });
      this.cd.detectChanges();
    });    
  }

  /**
   * get the warehouse to edit
   * @param id the id of warehouse
   */
  getWarehouse(id:number):void{
    this.warehousesService.getShow(id).subscribe(warehouse=>{
      /**the models in backend differs then the model is useless */
      let warehouseToPatch:any = warehouse;
      warehouseToPatch.groupId = warehouseToPatch.group.id;
      this.updateForm.patchValue(warehouseToPatch);
    })
  }

  /**
  * delete empty values 
  */
  sanitize(object:Object):Object{
    object = JSON.parse(JSON.stringify(object));
    Object.keys(object).forEach(key=>{
      let value = object[key];
      if(value === "" || value === null)
        delete object[key];
    });
    return object;
  }

  /**
  * get wharehousesgroups to show in the select
  */
  getWharehousesGroup():void{
    this.warehouseGroupService.getIndex().subscribe(warehousesGroups=>{
    this.groups = warehousesGroups;
      console.log(this.groups);
    });
  }

  /**
  * Save the new warehouse
  */
  submit(){
    this.warehousesService.put(this.sanitize(this.updateForm.value)).subscribe(data=>{
      this.utils.presentAlert("Éxito","Almacén editado con éxito");
      this.close();
    });
  }

  ngOnInit() {
    this.getWharehousesGroup();
    this.changeValidatorsAndValues();
  }

  /**close the current instance of the modal */
  close():void{
  this.modalCtrl.dismiss();
  }
}
