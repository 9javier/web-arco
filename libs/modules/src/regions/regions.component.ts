import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { validators } from '../utils/validators';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RegionsModel, RegionService, IntermediaryService } from '@suite/services';
import { StoreComponent } from './modal/store/store.component';
import { UpdateComponent } from './modal/update/update.component';


@Component({
  selector: 'suite-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit {

  regiones: Array<RegionsModel.Regions>
  
  columns:Array<string> = ['name', 'country', 'province', 'postalCode', 'select'];
  
  dataSource:MatTableDataSource<RegionsModel.Regions>;
  
  selectedForm:FormGroup = this.formBuilder.group({},{
    validators:validators.haveItemsInner("toSelect")
  });
  constructor(
    
    private regionService: RegionService,
    private intermediaryService: IntermediaryService,
    private formBuilder:FormBuilder,
    private modalCtrl:ModalController,

    ) { }

  ngOnInit() {
    this.list()
  }

  list() {
    this.regionService.list().subscribe(regions => {
      this.initSelectForm(regions);
      this.regiones = regions;
      this.dataSource = new MatTableDataSource<RegionsModel.Regions>(regions);

      console.log(this.regiones);
    })
    this.dataSource = new MatTableDataSource(this.regiones)
  }

  async storeRegion() {
    const modal = await this.modalCtrl.create({
      component: StoreComponent,
    });
    modal.onDidDismiss().then(()=>{
      this.list();
    });
    await modal.present();
  
  }

  async updateRegion(region: RegionsModel.Regions) {    
    const modal = await this.modalCtrl.create({
      component: UpdateComponent,
      componentProps:{
        region
      }
    });
    modal.onDidDismiss().then(()=>{
      this.list();
    });
    await modal.present();
  
  }
  deleteRegions():void{
    let deleteObservable = new Observable(observer=>observer.next());
    const selecteds:Array<{id:number,selected:boolean}> = this.selectedForm.value.toSelect;
    selecteds.forEach(region => {
      if(region.selected)
        deleteObservable = deleteObservable.pipe(switchMap(response=>{
          return this.regionService.delete(region.id);
        }));
    });
    this.intermediaryService.presentLoading();
    deleteObservable.subscribe(message=>{
      this.intermediaryService.dismissLoading();
      this.list();
    });
  }

  initSelectForm(buildings:Array<RegionsModel.Regions>):void{  
    this.selectedForm.removeControl("toSelect");
    this.selectedForm.addControl("toSelect",this.formBuilder.array(buildings.map(building=>{
      return this.formBuilder.group({
        id:building.id,
        selected:false
      });
    })));
  }

  selectAll(event):void{
    let value = event.detail.checked;
    (<FormArray>this.selectedForm.controls.toSelect).controls.forEach(control=>{
      control.get("selected").setValue(value);
    });
  }
  prevent(event):void{
    event.preventDefault();
    event.stopPropagation();
  }
}
