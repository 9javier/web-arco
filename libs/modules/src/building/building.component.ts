import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { BuildingModel } from '../../../services/src/models/endpoints/building.model';
import { BuildingService } from '../../../services/src/lib/endpoint/building/building.service';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { validators } from '../utils/validators';

@Component({
  selector: 'suite-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit {

  /**Columns to show in table */
  columns:Array<string> = ["name","select"];

  /**The data to be showed in html table */
  dataSource:MatTableDataSource<BuildingModel.Building>;

  /**form to select elements to print or for anything */
  selectedForm:FormGroup = this.formBuilder.group({},{
    validators:validators.haveItems("toSelect")
  });
  
  constructor(
    private modalCtrl:ModalController,
    private buildingService:BuildingService,
    private formBuilder:FormBuilder,
  ) { }

  ngOnInit() {
    this.getBuildings();
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
   * Open store building modal
   */
  async storeBuilding(){
    (await this.modalCtrl.create({
      component: StoreComponent
    })).present();
  }

  /**
   * Get all buildings and add it to datasource
   */
  getBuildings():void{
    this.buildingService.getIndex().subscribe(buildings=>{
      this.initSelectForm(buildings);
      this.dataSource = new MatTableDataSource<BuildingModel.Building>(buildings);
    });
  }

}
