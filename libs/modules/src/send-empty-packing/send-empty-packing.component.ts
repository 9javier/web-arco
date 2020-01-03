import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { CarrierService, WarehouseModel, IntermediaryService } from '@suite/services';
import { MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SendPackingComponent } from './send-packing/send-packing.component';
import { SendPackingManualComponent } from './send-packing-manual/send-packing-manual.component';

@Component({
  selector: 'app-send-empty-packing',
  templateUrl: './send-empty-packing.component.html',
  styleUrls: ['./send-empty-packing.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class SendEmptyPackingComponent implements OnInit {
  public title = 'Envio de Jaulas vacias';
  // public displayedColumns: string[] = ['select', 'reference', 'buttons-print' ];
  public columns: any[] = [{ name: 'ID', value: 'id' }, { name: 'Referencia', value: 'reference' }];
  public apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers').name;
  public routePath = '/send-empty-packing';

  types = [];
  displayedColumns = ['select', 'reference', 'destiny', 'products-status', 'isSend'];
  dataSource: MatTableDataSource<CarrierModel.Carrier>;
  expandedElement: CarrierModel.Carrier;

  carriers: Array<CarrierModel.Carrier> = [];
  warehouses: Array<WarehouseModel.Warehouse> = [];

  toDelete: FormGroup = this.formBuilder.group({
    jails: this.formBuilder.array([])
  });

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private carrierService: CarrierService,
    private warehouseService: WarehouseService,
    private intermediaryService: IntermediaryService,
    private alertControler: AlertController,
    private printerService: PrinterService,
    private loadController: LoadingController
  ) {
  }

  ngOnInit() {
    this.getTypePacking();
    this.getCarriers();
    this.getWarehouses();
  }

  /**
   * Return a type
   * @param id - the id of type
   */
  typeById(id: number) {
    if (this.types) {
      return this.types.find(type => type.id == id);
    }
    return { name: '' };
  }

  prevent(event) {
    // console.log(event);

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Open modal to edit jail
   * @param event - to cancel it
   * @param jail - jail to be updated
   */
  async toSend(event, jail) {
    event.stopPropagation();
    event.preventDefault();
    let modal = (await this.modalCtrl.create({
      component: SendPackingComponent,
      componentProps: {
        jail: jail
      }
    }))
    modal.onDidDismiss().then(() => {
      this.getCarriers();
    })
    modal.present();
  }
  

  getTypePacking() {
    this.intermediaryService.presentLoading();
    this.carrierService.getPackingTypes().subscribe(types => {
      this.types = types;
      this.intermediaryService.dismissLoading();
    })
  }
  delete() {
    let observable = new Observable(observer => observer.next());
    this.toDelete.value.jails.forEach(jail => {
      if (jail.selected)
        observable = observable.pipe(switchMap(resonse => {
          return this.carrierService.delete(jail.id)
        }))
    });
    this.intermediaryService.presentLoading();
    observable.subscribe(
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess(
          'Jaula eliminada con exito'
        );
        this.getCarriers();
      },
      () => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess('Error eliminando jaula');
      }
    );
  }

  cleanSelect(closeAlert?: boolean) {
    this.carrierService.getIndex().subscribe(carriers => {
      console.log(carriers);

      this.carriers = carriers;
      //this.carriers = this.carriers.map(this.isAvailableSend);
      this.toDelete.removeControl("jails");
      this.toDelete.addControl("jails", this.formBuilder.array(carriers.map(carrier => {
        return this.formBuilder.group({
          id: carrier.id,
          reference: carrier.reference,
          selected: false
        });
      })));
      this.dataSource = new MatTableDataSource(carriers);
      if (closeAlert) {
        this.intermediaryService.dismissLoading();
      }

    })
  }

  getCarriers(): void {
    this.intermediaryService.presentLoading();
    this.carrierService.getCarrierMeWarehouse().subscribe(carriers => {
      console.log(carriers);

      this.carriers = carriers;
      //this.carriers = this.carriers.map(this.isAvailableSend);
      this.toDelete.removeControl("jails");
      this.toDelete.addControl("jails", this.formBuilder.array(carriers.map(carrier => {
        return this.formBuilder.group({
          id: carrier.id,
          reference: carrier.reference,
          selected: false
        });
      })));
      this.dataSource = new MatTableDataSource(carriers);
      this.intermediaryService.dismissLoading();
    })
  }

  isAvailableSend(carrier) {
    return true;
  }

  /**
   * check if have items to delete
   */
  hasToDelete(): boolean {


    return !!this.toDelete.value.jails.find(jail => jail.selected);
  }



  async presentAlert(lista: CarrierModel.Carrier[], listaPresentada: CarrierModel.Carrier[]) {
    let listaRefereceJaulainviata = listaPresentada.map(x => x.reference);
    let newlista = [];
    let newlistaPrint = [];
    lista.forEach(item => {
      let er = '';
      if (item.carrierWarehousesDestiny.length === 0) {
        er = '- Sin destino';
      } else
        if (item.carrierWarehousesDestiny.length > 1) {
          er = '- Varios destinos';
        } else
          if (item.packingInventorys.length === 0) {
            er = '- Sin productos';
          } else
            if (item.status === 4 || item.status === 5) {
              if (item.status === 5) {
                er = '- Sin productos';
              }
              else
                if (item.status === 4) {
                  er = '- Precintada';
                }
            }
      newlistaPrint.push(item.reference + er);
    })
    let lstShow = "";
    newlistaPrint.map(x => {
      lstShow += `${x}</br>`;
      return `${x}</br>`
    });

    let lst = "";

    listaRefereceJaulainviata.map(x => {
      lst += `${x}</br>`;
      return `${x}</br>`
    });


    let alert;
    if (listaRefereceJaulainviata.length === 0) {

      alert = await this.alertControler.create({
        header: 'Aviso',
        message: `<b>Los siguientes embalajes no se pueden precintar</b></br></br>${lstShow}`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'danger',
            handler: () => {
              this.cleanSelect(false);
            }
          }
        ]
      });

    } else {

      if (listaRefereceJaulainviata.length > 0 && lista.length === 0) {
        alert = await this.alertControler.create({
          header: 'Confirmación',
          message: `<b>Embalajes que se van a precintar. ¿Está seguro?</b></br></br>${lst}</br>`,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'danger',
              handler: () => {
              }
            },
            {
              text: 'Aceptar',
              role: 'send',
              cssClass: 'primary',
              handler: () => {
                if (listaRefereceJaulainviata.length > 0) {
                  this.intermediaryService.presentLoading('Precintando Embalaje/s')
                  this.carrierService.postSealList(listaRefereceJaulainviata).subscribe(data => {
                    this.cleanSelect(true);
                  });
                }
              }
            }
          ]
        });
      } else {

        alert = await this.alertControler.create({
          header: 'Aviso',
          message: `<b>Embalajes que se van a precintar</b></br></br>${lst}</br></br><b>Embalajes que NO se van a precintar</b></br></br>${lstShow}`,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'danger',
              handler: () => {
              }
            },
            {
              text: 'Aceptar',
              role: 'send',
              cssClass: 'primary',
              handler: () => {
                if (listaRefereceJaulainviata.length > 0) {
                  this.intermediaryService.presentLoading('Precintando Embalaje/s')
                  this.carrierService.postSealList(listaRefereceJaulainviata).subscribe(data => {
                    this.cleanSelect(true);
                  });
                }
              }
            }
          ]
        });
      }
    }




    await alert.present();
  }

  private async printReferencesList(listReferences: Array<string>) {
    if ((<any>window).cordova) {
      this.printerService.print({ text: listReferences, type: 0 });
    } else {
      return await this.printerService.printBarcodesOnBrowser(listReferences);
    }
  }

  /**
   * Change one destination
   * @param prev the previous warehouse
   * @param current the current value of this destination
   */
  updateDestination(prev: number, current: number): void {
    this.intermediaryService.presentLoading();
    this.carrierService.updateDestination(prev, { destinationWarehouseId: current }).subscribe(() => {
      this.intermediaryService.presentToastSuccess("Destino actualizado con éxito");
      this.intermediaryService.dismissLoading();
      this.getCarriers();
    }, () => {
      this.intermediaryService.presentToastError("Error al actualizar destino");
      this.intermediaryService.dismissLoading();
    });
  }

  setDestination(carrierId: number, current: number): void {
    this.intermediaryService.presentLoading();
    this.carrierService.setDestination(carrierId, current).subscribe(() => {
      this.intermediaryService.presentToastSuccess("Destino actualizado con éxito");
      this.intermediaryService.dismissLoading();
      this.getCarriers();
    }, () => {
      this.intermediaryService.presentToastError("Error al actualizar destino");
      this.intermediaryService.dismissLoading();
    });
  }

  getWarehouses() {
    this.intermediaryService.presentLoading();
    this.warehouseService.getIndex().then(observable => {
      observable.subscribe(response => {
        this.warehouses = (<any>response.body).data;
        this.intermediaryService.dismissLoading();
      });
    })
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async moveToFirst() {
    const modal = await this.modalCtrl.create({
      component: 'StoreComponent'
    });

    return await modal.present();
  }

  async toScanner(event) {
    event.stopPropagation();
    event.preventDefault();
    let modal = (await this.modalCtrl.create({
      component: SendPackingManualComponent,
      componentProps: {
        //jail: jail
      }
    }))
    modal.onDidDismiss().then(() => {
      this.getCarriers();
    })
    modal.present();   
  }
}




