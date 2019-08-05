import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ModalController } from "@ionic/angular";
import { WarehousesService,WarehouseGroupService,WarehouseGroupModel,BuildingModel, BuildingService, GroupWarehousePickingService, GroupWarehousePickingModel } from '@suite/services';
import { UtilsComponent } from '../../components/utils/utils.component';
import { IntermediaryService } from '@suite/services';

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
    groupsWarehousePicking:[''],
    is_main: [false, []],
    has_racks: [false, []],
    hasBuilding: [false,[]],
    buildingId:[''],
    prefix_container:['',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]],
    halls:'',
    rows:'',
    columns:'',
    is_outlet:false
  });

  buildings:Array<BuildingModel.Building> = [];
  groups:Array<WarehouseGroupModel.WarehouseGroup>=[]
  groupWarehousesPicking:Array<GroupWarehousePickingModel.GroupWarehousePicking> = [];

  constructor(
              private intermediaryService:IntermediaryService,
              private modalCtrl:ModalController,
              private formBuilder:FormBuilder,
              private warehousesService:WarehousesService,
              private warehouseGroupService:WarehouseGroupService,
              private cd: ChangeDetectorRef,
              private buildingService:BuildingService,
              private groupWarehousePickingService:GroupWarehousePickingService
              ) {}

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

  getGroupWarehousePicking():void{
    this.groupWarehousePickingService.getIndex().subscribe(groups=>{
      this.groupWarehousesPicking = groups;
    });
  }

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
      this.cd.detectChanges();
    });

    /**Listen for changes on hasBuilding control */
    this.createForm.get("hasBuilding").valueChanges.subscribe((hasBuilding)=>{
      let buildingId = this.createForm.get("buildingId")
      buildingId.clearValidators();
      buildingId.setValue("");
      buildingId.setValidators(hasBuilding?[Validators.required]:[])
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
  sanitize(object:any):Object{
    object = JSON.parse(JSON.stringify(object));
    object.prefix_container = object.prefix_container.toUpperCase();
    object.reference = object.reference.toString();
    object.reference = (object.reference.length==1)?("00"+object.reference):(object.reference.length==2)?("0"+object.reference):(object.reference);
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
    },(error)=>{
      /**We obtain the error message */
      let errorMessage:string = error.error.errors;
      /**Check if it is an reference error */
      if(errorMessage.includes("Duplicate entry"))
        this.intermediaryService.presentToastError("La referencia ya está siendo usada");
      else if(errorMessage.includes("Already exist a main"))
      this.intermediaryService.presentToastError("Ya existe un almacén principal");
    });
  }

  ngOnInit() {
    this.getWharehousesGroup();
    this.getBuildings();
    this.changeValidatorsAndValues();
    this.getGroupWarehousePicking();
  }

  /**close the current instance of the modal */
  close():void{
    this.modalCtrl.dismiss();
  }
}
