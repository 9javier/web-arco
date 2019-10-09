import { Component, OnInit } from '@angular/core';
import { WarehouseModel, IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { CrudService } from '@suite/common/ui/crud';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { validators } from 'libs/modules/src/utils/validators';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UserModel, RolModel } from '@suite/services';
import { TemplateZonesService } from 'libs/services/src/lib/endpoint/template-zones/template-zones.service';
import { TemplateZoneModel } from 'libs/services/src/models/endpoints/TemplateZone';
@Component({
  selector: 'suite-warehouses-modal',
  templateUrl: './warehouses-modal.component.html',
  styleUrls: ['./warehouses-modal.component.scss']
})
export class WarehousesModalComponent implements OnInit {

  warehouses: WarehouseModel.Warehouse[] = [];
  warehousesFromZone = [];
  selectedAll: any;
  displayedColumnsWareHouse: any = ['name', 'check'];
  selectedForm: FormGroup;
  items: FormArray;
  toSelect: number[] = [];
  idTemplate: number;
  id: number;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams,
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private templateZonesService: TemplateZonesService
  ) {
    this.warehousesFromZone = this.navParams.get("warehouses"); 
    this.idTemplate = this.navParams.get("idTemplate"); 
    this.id = this.navParams.get("id"); 

    this.selectedForm = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([ this.createSelect() ])
      },
      {
        validators: validators.haveItems('toSelect')
      }
    );
    console.log(this.selectedForm)
  }

  ngOnInit() {
    this.crudService
      .getIndex('Warehouses')
      .then(
        (
          data: Observable<
            HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>
          >
        ) => {
          data.subscribe(
            (
              res: HttpResponse<
                UserModel.ResponseIndex | RolModel.ResponseIndex
              >
            ) => {
              this.warehouses = res.body.data;
              console.log(this.warehouses);
              this.initSelect(this.warehouses);
            },
            (err) => {
              console.log(err)
            }, () => {

            }
          );
        }
      );
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    const controlArray = <FormArray> this.selectedForm.get('toSelect');
    let warehousesToSend: number[] = [];
    console.log(controlArray)
    controlArray.controls.forEach((control, index) => {
        for(let i = 0; i < this.warehouses.length; i++) {
          if(control.value && i == index) {
            console.log(this.warehouses[i].id)
            warehousesToSend.push(this.warehouses[i].id);
          }
        }
    });

    let zoneWarehouses: TemplateZoneModel.ZoneWarehouse[] = [{
      zone: this.id,
      warehouses: warehousesToSend
    }];

    let dataToSend: TemplateZoneModel.ZonesWarehouses = {
      zones: zoneWarehouses
    }

    this.templateZonesService.assignZoneWarehouseSorter(dataToSend, this.idTemplate).subscribe((data) =>{
      console.log(data);
      this.close();
    }, (err) => {
      console.log(err);
    })
  }

  selectAll(event):void{
    let value = event.detail.checked;
    const controlArray = <FormArray> this.selectedForm.get('toSelect');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
  }

  initSelect(items) {
    this.selectedForm.removeControl('toSelect');
    this.selectedForm.addControl('toSelect', this.formBuilder.array(items.map(item => new FormControl(Boolean(false)))));
    
    console.log(this.warehousesFromZone)

    for(let i = 0; i < this.warehouses.length; i++) {
      this.warehousesFromZone.forEach(warehouse => {
        if(warehouse.warehouses.id === this.warehouses[i].id) {
          this.toSelect.push(i);
        }
      });
    }
    const controlArray = <FormArray> this.selectedForm.get('toSelect');
    controlArray.controls.forEach((control, i) => {
      this.toSelect.forEach(check => {
        if(check == i) {
          control.setValue(true);
        }
      });
    });
  }

  createSelect(): FormControl {
    return new FormControl(Boolean(false));
  }
}