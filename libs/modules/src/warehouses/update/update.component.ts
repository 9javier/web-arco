import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from "@ionic/angular";
import { WarehousesService,WarehouseGroupService,WarehouseGroupModel,BuildingModel,BuildingService } from '@suite/services';
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
    prefix_container:['',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]],
    hasBuilding: [false,[]],
    buildingId:[''],
    is_main: [false, []],
    has_racks: [false, []],
    halls:'',
    rows:'',
    columns:'',
    is_outlet:false
  });
  private warehouseId;
  private currentHasRacks;
  buildings:Array<BuildingModel.Building> = [];
  groups:Array<WarehouseGroupModel.WarehouseGroup>=[]
  constructor(private modalCtrl:ModalController,
    private formBuilder:FormBuilder,
    private warehousesService:WarehousesService,
    private warehouseGroupService:WarehouseGroupService,
    private cd: ChangeDetectorRef,
    private navParams:NavParams,
    private buildingService:BuildingService
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

        /**Listen for changes on hasBuilding control */
        this.updateForm.get("hasBuilding").valueChanges.subscribe((hasBuilding)=>{
          let buildingId = this.updateForm.get("buildingId")
          buildingId.clearValidators();
          buildingId.setValue("");
          buildingId.setValidators(hasBuilding?[Validators.required]:[])
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

      this.currentHasRacks = warehouse.has_racks;
      let warehouseToPatch:any = warehouse;
      if(warehouse.group)
        warehouseToPatch.groupId = warehouseToPatch.group.id;
      this.updateForm.patchValue(warehouseToPatch);
    })
  }


  /**
   * Event triggered when user press a key in a field
   * @param event event triggered
   */
  onlyUpperLetters(event){
    let key = event.key
    return /[a-zA-Z]/.test(key);
  }

    /**
   * Get all registereds buildings
   */
  getBuildings():void{
    this.buildingService.getIndex().subscribe(buildings=>{
      this.buildings = buildings
    });
  }

  /**
  * delete empty values 
  */
  sanitize(object:any):Object{
    object = JSON.parse(JSON.stringify(object));
    object.prefix_container = object.prefix_container.toUpperCase();
    Object.keys(object).forEach(key=>{
      let value = object[key];
      if(value === "" || value === null)
        delete object[key];
    });
    delete object.reference;
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
    this.getBuildings();
    this.changeValidatorsAndValues();
  }

  /**close the current instance of the modal */
  close():void{
  this.modalCtrl.dismiss();
  }
}
