import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ModalController, NavParams } from "@ionic/angular";
import { WarehousesService,WarehouseGroupService,WarehouseGroupModel,BuildingModel,BuildingService, GroupWarehousePickingService, GroupWarehousePickingModel, AgencyService, AgencyModel } from '@suite/services';
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
    groupsWarehousePicking:[''],
    prefix_container:['',[Validators.required,Validators.minLength(1),Validators.maxLength(4)]],
    hasBuilding: [false,[]],
    buildingId:[''],
    is_main: [false, []],
    has_racks: [false, []],
    halls:'',
    rows:'',
    columns:'',
    TypePackingId:['',Validators.required],
    thresholdShippingStore:['',Validators.required],
    manageAgencyId:'',
    is_outlet:false
  });
  groupWarehousesPicking:Array<GroupWarehousePickingModel.GroupWarehousePicking> = [];
  private warehouseId;
  agencies:AgencyModel.Agency[] = [];
  packingTypes:Array<any> = [];
  private currentHasRacks;
  buildings:Array<BuildingModel.Building> = [];
  groups:Array<WarehouseGroupModel.WarehouseGroup>=[]
  constructor(private modalCtrl:ModalController,
    private formBuilder:FormBuilder,
    private agencyService:AgencyService,
    private warehousesService:WarehousesService,
    private warehouseGroupService:WarehouseGroupService,
    private cd: ChangeDetectorRef,
    private navParams:NavParams,
    private buildingService:BuildingService,
    private groupWarehousePickingService:GroupWarehousePickingService
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
   * Get all agencies
   */
  getAgencies(){
    this.agencyService.getAll().subscribe(agencies=>{
      this.agencies = agencies;
    })
  }

  /**
   * Get the packing types
   */
  getPackingTypes(){
    this.warehousesService.getTypePacking().subscribe((packingTypes)=>{
      this.packingTypes = packingTypes;
    })
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
      if(warehouseToPatch.manageAgency)
        warehouseToPatch.manageAgencyId = warehouseToPatch.manageAgency.id;
      if(warehouseToPatch.packingType)
        warehouseToPatch.TypePackingId = warehouseToPatch.packingType;
      warehouseToPatch.groupsWarehousePicking = warehouseToPatch.groupsWarehousePicking.map(group=>{
        return group.id
      });
      this.updateForm.patchValue(warehouseToPatch);
    })
  }

  getGroupWarehousePicking():void{
    this.groupWarehousePickingService.getIndex().subscribe(groups=>{
      this.groupWarehousesPicking = groups;
    });
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
  onlyNumbers(event){
    let key = event.key
    return /[0-9]/.test(key);
  }
  /**
  * delete empty values 
  */
  sanitize(object:any):Object{
    object = JSON.parse(JSON.stringify(object));
    object.prefix_container = object.prefix_container.toUpperCase();
    if(object.manageAgencyId)
      object.manageAgencyId = parseInt(object.manageAgencyId);
    if(object.thresholdShippingStore)
      object.thresholdShippingStore = parseInt(object.thresholdShippingStore)
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
    this.getAgencies();
    this.getPackingTypes();
    this.changeValidatorsAndValues();
    this.getGroupWarehousePicking();
  }

  /**close the current instance of the modal */
  close():void{
  this.modalCtrl.dismiss();
  }
}
