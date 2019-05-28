import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ModalController } from "@ionic/angular";
import { WarehousesService,WarehouseGroupService,WarehouseGroupModel } from '@suite/services';
import { UtilsComponent } from '../../components/utils/utils.component';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @ViewChild(UtilsComponent) utils:UtilsComponent;
  createForm:FormGroup = this.formBuilder.group({
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

  groups:Array<WarehouseGroupModel.WarehouseGroup>=[]

  constructor(private modalCtrl:ModalController,
              private formBuilder:FormBuilder,
              private warehousesService:WarehousesService,
              private warehouseGroupService:WarehouseGroupService,
              private cd: ChangeDetectorRef
              ) {}

  /**
   * Assign and unassign validators depends of value of another validators
   */
  changeValidatorsAndValues():void{
    let values = this.createForm.value;
    /**Listen for changes on is_store control */
    this.createForm.get("is_store").valueChanges.subscribe((isStore)=>{
      let store = this.createForm.get("groupId")
      store.clearValidators();
      store.setValue("");
      store.setValidators(isStore?[Validators.required]:[]);
      this.cd.detectChanges();
    });

    /**
     * Listen for changes in has_racks control 
    */
    this.createForm.get("has_racks").valueChanges.subscribe((hasRacks)=>{
      let halls = this.createForm.get("halls");
      let rows = this.createForm.get("rows")
      let columns = this.createForm.get("columns")
      let aux = [halls,rows,columns].forEach(control=>{
        control.clearValidators();
        control.setValue("");
        control.setValidators(control?[Validators.required]:[]);
      });
      this.cd.detectChanges();
    });    
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
    this.warehousesService.postStore(this.sanitize(this.createForm.value)).subscribe(data=>{
      this.utils.presentAlert("Éxito","Nuevo almacén creado con éxito");
      this.close();
    })
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
