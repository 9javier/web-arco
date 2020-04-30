import {Component, OnInit} from '@angular/core';
import {COLLECTIONS} from 'config/base';
import {NavParams, ModalController} from '@ionic/angular';
import {WarehousesService, WarehouseModel} from '@suite/services';
import {MatSelectChange} from '@angular/material';
import {CarrierService, IntermediaryService} from '@suite/services';
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";
import * as _ from 'lodash';

@Component({
  selector: 'suite-multiple-destinations',
  templateUrl: './multiple-destinations.component.html',
  styleUrls: ['./multiple-destinations.component.scss']
})
export class MultipleDestinationsComponent implements OnInit {
  title = 'Agregar Destino';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers').name;

  redirectTo = '/jails/list';
  lista;
  warehouses: Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;
  listWithNoDestiny;
  listWithDestiny;
  listToPrecintar = [];
  ListToSeal = [];
  ListNoProducts = [];
  ListToAddDestiny = [];

  constructor(
    private carriersService: CarriersService,
    private navParams: NavParams,
    private modalController: ModalController,
    private warehousesService: WarehousesService,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService
  ) {
    this.listWithDestiny = this.navParams.get("listWithDestiny");
    this.listWithNoDestiny = this.navParams.get("listWithNoDestiny");
    this.allListToDestiny();
  }

  ngOnInit() {
    this.warehousesService.getListAllWarehouses().then(res => {
        this.warehouses = res.data;
    });
  }

  close(reload: boolean = false) {
    this.modalController.dismiss(reload);
  }

  selectDestiny(event: MatSelectChange, idCarrier) {
    if (event.value.id) {
      idCarrier.destiny = event.value.id
    }
    let exist = _.find(this.listToPrecintar, {'carrierId': idCarrier.id});
    if (exist) {
      _.remove(this.listToPrecintar, function (n) {
        return n.carrierId == idCarrier.id;
      });
      this.listToPrecintar.push({
        destinationWarehouseId: event.value.id,
        carrierId: idCarrier.id
      });
    } else {
      this.listToPrecintar.push({
        destinationWarehouseId: event.value.id,
        carrierId: idCarrier.id
      });
    }
    this.warehouse = event.value;
  }

  submit() {
    this.checkPackingWoDestiny();
  }

  async addDestiny(listToDestiny) {
    try {
      this.carrierService.setDestinationMultiple(listToDestiny).subscribe(() => {
        this.SealAll();
      }, () => {
        this.intermediaryService.presentToastSuccess("Error al agregar destino, intentelo de nuevo");
        this.intermediaryService.dismissLoading();
      });
    } catch (error) {
      this.intermediaryService.presentToastError("Error al agregar destino, intentelo de nuevo");
      this.intermediaryService.dismissLoading();
      this.close(true);
    }
  }

  allListToDestiny() {
    for (let i = 0; i < this.listWithNoDestiny.length; i++) {
      let error1 = '';
      let icon1 = '';
      if (this.listWithNoDestiny[i].status == 4) {
        error1 = 'Ya precintado';
        icon1 = 'launch';
      } else if (this.listWithNoDestiny[i].products == 0) {
        error1 = 'Vacía';
        icon1 = 'inbox';
      } else if (this.listWithNoDestiny[i].destiny > 1) {
        error1 = 'Múltiples destinos';
        icon1 = 'call_split';
      }

      if (error1.length <= 0) {
        this.listWithNoDestiny[i].destiny = null;
        this.ListToAddDestiny.push(this.listWithNoDestiny[i]);
      } else {
        this.ListNoProducts.push({icon: icon1, reference: this.listWithNoDestiny[i].reference, mesage: error1});
      }
    }

    for (let j = 0; j < this.listWithDestiny.length; j++) {
      let error = '';
      let icon = '';
      if (this.listWithDestiny[j].status == 4) {
        error = 'Ya precintado';
        icon = 'launch';
      } else if (this.listWithDestiny[j].destiny > 1) {
        error = 'Múltiples destinos';
        icon = 'call_split';
      } else if (this.listWithDestiny[j].products == 0) {
        error = 'Vacía';
        icon = 'inbox';
      }

      if (error.length <= 0) {
        this.ListToSeal.push(this.listWithDestiny[j]);
      } else {
        this.ListNoProducts.push({icon: icon, reference: this.listWithDestiny[j].reference, mesage: error});
      }
    }
  }

  checkPackingWoDestiny() {
    if (this.ListToAddDestiny.length > 0) {
      const packingWoDestiny = !!this.ListToAddDestiny.find(p => p.destiny == null);
      if (packingWoDestiny) {
        this.intermediaryService.presentToastError('Seleccione un destino para todos los embalajes para poder precintarlos.');
      } else {
        if (this.listWithNoDestiny.length > 0 && this.listToPrecintar.length > 0) {
          this.addDestiny(this.listToPrecintar);
        } else if (this.listWithDestiny.length > 0) {
          this.SealAll();
        } else {
          if (this.ListToSeal.length <= 0) {
            this.intermediaryService.presentToastError("No se pueden  precintar estos embalajes");
            this.intermediaryService.dismissLoading();
          } else {
            this.intermediaryService.presentToastError("Error llena los campos de destino");
            this.intermediaryService.dismissLoading();
          }
        }
      }
    } else {
      if (this.listWithNoDestiny.length > 0 && this.listToPrecintar.length > 0) {
        this.addDestiny(this.listToPrecintar);
      } else if (this.listWithDestiny.length > 0) {
        this.SealAll();
      } else {
        if (this.ListToSeal.length <= 0) {
          this.intermediaryService.presentToastError("No se pueden  precintar estos embalajes");
          this.intermediaryService.dismissLoading();
        } else {
          this.intermediaryService.presentToastError("Error llena los campos de destino");
          this.intermediaryService.dismissLoading();
        }
      }
    }
  }

  SealAll() {
    let listToSeal = [];
    for (let i = 0; i < this.ListToAddDestiny.length; i++) {
      listToSeal.push({reference: this.ListToAddDestiny[i].reference});
    }
    for (let j = 0; j < this.ListToSeal.length; j++) {
      listToSeal.push({reference: this.ListToSeal[j].reference});
    }
    this.postPrecintar(listToSeal);
  }

  async postPrecintar(listToSeal) {
    this.intermediaryService.presentLoading('Precintando embalajes...').then(() => {
      this.carrierService.postSeals(listToSeal).subscribe((res: any) => {
        let errorText = res && res.errors ? res.errors : "Ha ocurrido un error al intentar precintar los embalajes.";
        if (res.code == 200) {
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastSuccess("Los embalajes han sido precintados.");
          this.close(true);
        } else {
          this.intermediaryService.presentToastError(errorText);
          this.intermediaryService.dismissLoading();
        }
      }, (err) => {
        let errorText = err && err.error && err.error.errors ? err.error.errors : "Ha ocurrido un error al intentar precintar los embalajes.";
        this.intermediaryService.presentToastError(errorText);
        this.intermediaryService.dismissLoading();
      })
    });
  }

  getWarehousesForPacking(packingWarehouse: number) {
    return this.warehouses.filter(w => w.id != packingWarehouse);
  }
}
