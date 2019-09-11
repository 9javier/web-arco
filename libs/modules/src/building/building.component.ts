import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { BuildingModel } from '../../../services/src/models/endpoints/building.model';
import { BuildingService } from '../../../services/src/lib/endpoint/building/building.service';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup,FormArray } from '@angular/forms';
import { validators } from '../utils/validators';
import { IntermediaryService } from '@suite/services';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InformationComponent } from './modals/information/information.component';
import { UpdateComponent } from './modals/update/update.component';

@Component({
  selector: 'suite-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit {

  /**Columns to show in table */
  columns:Array<string> = ["name","phone","address","agency","select"];

  /**The data to be showed in html table */
  dataSource:MatTableDataSource<BuildingModel.Building>;

  /**form to select elements to print or for anything */
  selectedForm:FormGroup = this.formBuilder.group({},{
    validators:validators.haveItemsInner("toSelect")
  });
  
  constructor(
    private modalCtrl:ModalController,
    private buildingService:BuildingService,
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService
  ) { }

  ngOnInit() {
    this.getBuildings();
  }

  /**
   * Update Building
   * @param building the building to be updated
   */
  async update(building:BuildingModel.Building){
    let updateModal = (await this.modalCtrl.create({
      component: UpdateComponent,
      componentProps:{
        building
      }
    }));
    updateModal.onDidDismiss().then(()=>{
      this.getBuildings();
    });
    updateModal.present();
  }

  /**
   * Cancel the normal behaviour of event
   * @param event event to cancel
   */
  prevent(event):void{
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * init selectForm controls
   */
  initSelectForm(buildings:Array<BuildingModel.Building>):void{  
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect",this.formBuilder.array(buildings.map(building=>{
      return this.formBuilder.group({
        id:building.id,
        selected:false
      });
    })));
  }

    /**
   * Select or unselect all visible buildings
   * @param event to check the status
   */
  selectAll(event):void{
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control=>{
      control.get("selected").setValue(value);
    });
  }



  /**
   * Open store building modal
   */
  async storeBuilding(){
    let storeModal = (await this.modalCtrl.create({
      component: StoreComponent
    }));
    storeModal.onDidDismiss().then(()=>{
      this.getBuildings();
    });
    storeModal.present();
  }

  /**
   * Get all buildings and add it to datasource
   */
  getBuildings():void{
    this.intermediaryService.presentLoading();
    this.buildingService.getIndex().subscribe(buildings=>{
      this.initSelectForm(buildings);
      this.dataSource = new MatTableDataSource<BuildingModel.Building>(buildings);
    }, (err) => {
      // console.log(err)
    }, () => {
      this.intermediaryService.dismissLoading();
    });
  }

  /**
   * Delete all selected buildings
   */
  deleteBuildings():void{
    let deleteObservable = new Observable(observer=>observer.next());
    let selecteds:Array<{id:number,selected:boolean}> = this.selectedForm.value.toSelect;
    selecteds.forEach(building => {
      if(building.selected)
        deleteObservable = deleteObservable.pipe(switchMap(response=>{
          return this.buildingService.delete(building.id);
        }));
    });
    this.intermediaryService.presentLoading();
    deleteObservable.subscribe(message=>{
      this.intermediaryService.dismissLoading();
      this.getBuildings();
    });
  }

}
