import { Component, OnInit } from '@angular/core';
import { WarehouseModel, IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { CrudService } from '@suite/common/ui/crud';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { validators } from 'libs/modules/src/utils/validators';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { UserModel, RolModel } from '@suite/services';
@Component({
  selector: 'suite-warehouses-modal',
  templateUrl: './warehouses-modal.component.html',
  styleUrls: ['./warehouses-modal.component.scss']
})
export class WarehousesModalComponent implements OnInit {

  warehouses: WarehouseModel.Warehouse[] = [];
  selectedAll: any;
  displayedColumnsWareHouse: any = ['name', 'check'];
  selectedForm: FormGroup;
  items: FormArray;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams,
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    
  ) {
    this.warehouses = this.navParams.get("warehouses"); 
    console.log(this.warehouses)

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
    console.log('submit')
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
  }

  createSelect(): FormControl {
    return new FormControl(Boolean(false));
  }
}
