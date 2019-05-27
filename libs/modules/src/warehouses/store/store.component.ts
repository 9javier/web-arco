import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ModalController } from "@ionic/angular";
import { WarehousesService,WarehouseGroupService,WarehouseGroupModel } from '@suite/services';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  createForm:FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', Validators.required],
    reference: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    is_store: [false, []],
    store:'',
    is_main: [false, []],
    has_racks: [false, []],
    hallways:'',
    height:'',
    columns:''
  });

  groups:Array<WarehouseGroupModel.WarehouseGroup>=[]

  constructor(private modalCtrl:ModalController,
              private formBuilder:FormBuilder,
              private warehousesService:WarehousesService,
              private warehouseGroupService:WarehouseGroupService,
              private cd: ChangeDetectorRef) {}

  /**
   * Assign and unassign validators depends of value of another validators
   */
  changeValidatorsAndValues():void{
    let values = this.createForm.value;
    /**Listen for changes on is_store control */
    this.createForm.get("is_store").valueChanges.subscribe((isStore)=>{
      let store = this.createForm.get("store")
      store.clearValidators();
      store.setValue("");
      store.setValidators(isStore?[Validators.required]:[]);
      this.cd.detectChanges();
    });

    /**
     * Listen for changes in has_racks control 
    */
    this.createForm.get("has_racks").valueChanges.subscribe((hasRacks)=>{
      let hallways = this.createForm.get("hallways");
      let height = this.createForm.get("height")
      let columns = this.createForm.get("columns")
      let aux = [hallways,height,columns].forEach(control=>{
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

  submit(){
    this.warehousesService.postStore(this.sanitize(this.createForm.value)).subscribe(data=>{
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
