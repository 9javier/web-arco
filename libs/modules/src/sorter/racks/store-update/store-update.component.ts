import { Component, OnInit } from '@angular/core';
import { RackService } from '../../../../../services/src/lib/endpoint/rack/rack.service';
import { ModalController } from '@ionic/angular';
import { IntermediaryService, WarehouseModel, WarehousesService } from '@suite/services';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ExceptionsType } from '../../../../../services/src/models/exceptions.type';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'suite-store-update',
  templateUrl: './store-update.component.html',
  styleUrls: ['./store-update.component.scss'],
})
export class StoreUpdateComponent implements OnInit {
  warehouses: WarehouseModel.Warehouse[];
  belongWarehouses: WarehouseModel.Warehouse[];
  constructor(
    public rackService: RackService,
    private modalController:ModalController,
    private warehouseService:WarehousesService,
    private intermediaryService: IntermediaryService,
  ) { }

  ngOnInit() {
    this.getWarehouses();
    this.rackService.form.get('warehouse').setValue(this.rackService.form.get('warehouse').value.id);
  }

  async close() {
    this.rackService.form.reset();
    this.rackService.initializeFormGroup();
    await this.modalController.dismiss();
  }

  async onSubmit() {
    if (this.rackService.form.valid) {
      await this.intermediaryService.presentLoading();

      if (this.rackService.form.get('id').value === '') {
        this.rackService.form.removeControl('id');
        this.rackService.store(this.rackService.form.value).subscribe(async data => {
          await this.intermediaryService.dismissLoading();
          await this.intermediaryService.presentToastSuccess('Estante creado con exito');
          await this.close();
        }, async (error) => {
          let messageError = 'Error creando el Estante';
          console.log(error.error);
          if (error.error.statusCode === ExceptionsType.ER_DUP_ENTRY && error.error.errors.includes(ExceptionsType[ExceptionsType.ER_DUP_ENTRY])) {
            messageError = 'Ya existe un registro con los mismos datos';
          }
          await this.intermediaryService.presentToastError(messageError);
          await this.intermediaryService.dismissLoading();

        });
        this.rackService.form.addControl('id', new FormControl(''));
      } else {
        let _id = this.rackService.form.get('id').value;
        this.rackService.form.removeControl('id');

        this.rackService.update(_id, this.rackService.form.value).subscribe(async data => {
          _id = '';
          await this.intermediaryService.dismissLoading();
          await this.intermediaryService.presentToastSuccess('Estante actualizado con exito');
          await this.close();
        }, async (error) => {
          let messageError = 'Error actualizando el Estante';
          console.log(error.error);
          if (error.error.statusCode === ExceptionsType.ER_DUP_ENTRY && error.error.errors && error.error.errors.includes(ExceptionsType[ExceptionsType.ER_DUP_ENTRY])) {
            messageError = 'Ya existe un registro con los mismos datos';
          }
          await this.intermediaryService.presentToastError(messageError);
          await this.intermediaryService.dismissLoading();
        });
        this.rackService.form.addControl('id', new FormControl(_id));
      }
    }
  }

  getWarehouses() {
    this.warehouseService.getIndex().then((warehouses: Observable<HttpResponse<WarehouseModel.ResponseIndex>>) => {
      warehouses.subscribe((res: HttpResponse<WarehouseModel.ResponseIndex>) => {
        this.warehouses = res.body.data;
        this.belongWarehouses = res.body.data;
      })
    })
  }
}
