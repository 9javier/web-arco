import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import {from, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService, environment, InventoryModel, InventoryService} from "@suite/services";
import {AlertController, Events, ToastController} from "@ionic/angular";
import {ShoesPickingModel} from "../../../../services/src/models/endpoints/ShoesPicking";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {switchMap} from "rxjs/operators";
import {PickingProvider} from "../../../../services/src/providers/picking/picking.provider";
import {Location} from "@angular/common";

@Component({
  selector: 'suite-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  dataToWrite: string = 'CONTENEDOR';
  containerReference: string = null;
  inputPicking: string = null;
  scanJail: string = null;
  nexProduct: ShoesPickingModel.ShoesPicking = null;

  pickingId: number;
  listProducts: ShoesPickingModel.ShoesPicking[];
  typePacking: number;
  packingReference: string = null;
  processInitiated: boolean = false;
  jailReference: string = null;
  lastCodeScanned: string = 'start';
  productsScanned: string[] = [];
  literalsJailPallet: any = null;

  private postVerifyPackingUrl = environment.apiBase+"/workwaves/order/packing";
  private getPendingListByPickingUrl = environment.apiBase+"/shoes/picking/{{id}}/pending";
  private putProductNotFoundUrl = environment.apiBase+"/shoes/picking/{{workWaveOrderId}}/product-not-found/{{productId}}";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private location: Location,
    private events: Events,
    private toastController: ToastController,
    private alertController: AlertController,
    private warehouseService: WarehouseService,
    private inventoryService: InventoryService,
    private pickingProvider: PickingProvider
  ) {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  ngOnInit() {
    this.pickingId = this.pickingProvider.pickingId;
    this.listProducts = this.pickingProvider.listProducts;
    this.typePacking = this.pickingProvider.typePacking;
    this.packingReference = this.pickingProvider.packingReference;
    this.literalsJailPallet = this.pickingProvider.literalsJailPallet;

    if (this.listProducts.length > 0) {
      this.showTextStartScanPacking(true, this.typePacking, this.packingReference || '');
    } else {
      this.jailReference = this.packingReference;
      this.processInitiated = true;
      this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
    }
  }

  keyUpInput(event) {
    let dataWrited = this.inputPicking;

    if (event.keyCode == 13 && dataWrited) {
      if (dataWrited.match(/J([0-9]){4}/) || dataWrited.match(/P([0-9]){4}/)) {
        if (!this.processInitiated) {
          let typePackingScanned = 0;
          if (dataWrited.match(/J([0-9]){4}/)) {
            typePackingScanned = 1;
          } else {
            typePackingScanned = 2;
          }

          if ((this.packingReference && this.packingReference == dataWrited) || !this.packingReference) {
            if (typePackingScanned == this.typePacking) {
              this.postVerifyPacking({
                status: 2,
                pickingId: this.pickingId,
                packingReference: dataWrited
              })
                .subscribe((res) => {
                  if (dataWrited.match(/J([0-9]){4}/)) {
                    this.typePacking = 1;
                  } else {
                    this.typePacking = 2;
                  }
                  this.processInitiated = true;
                  this.inputPicking = null;
                  this.jailReference = dataWrited;
                  this.dataToWrite = 'PRODUCTO';
                  if (!this.packingReference) {
                    this.packingReference = this.jailReference;
                  }
                  this.setNexProductToScan(this.listProducts[0]);
                  this.presentToast(`${this.literalsJailPallet[this.typePacking].process_started}${this.jailReference}.`, 2000, this.pickingProvider.colorsMessage.info.name);
                  this.showTextStartScanPacking(false, this.typePacking, '');
                }, (error) => {
                  this.inputPicking = null;
                  if (error.error.code == 404) {
                    this.presentToast(this.literalsJailPallet[this.typePacking].not_registered, 2000, this.pickingProvider.colorsMessage.error.name);
                  } else {
                    this.presentToast(error.error.errors, 2000, this.pickingProvider.colorsMessage.error.name);
                  }
                });
            } else {
              this.inputPicking = null;
              this.presentToast(this.literalsJailPallet[this.typePacking].wrong_packing, 2000, this.pickingProvider.colorsMessage.error.name);
            }
          } else {
            this.inputPicking = null;
            this.presentToast(`${this.literalsJailPallet[this.typePacking].process_resumed}${this.packingReference}.`, 2000, this.pickingProvider.colorsMessage.error.name);
          }
        } else if (this.listProducts.length != 0) {
          this.inputPicking = null;
          this.presentToast('Continúe escaneando los productos que se le indican antes de finalizar el proceso.', 2000, this.pickingProvider.colorsMessage.error.name);
        } else if (this.jailReference != dataWrited) {
          this.inputPicking = null;
          this.presentToast(this.literalsJailPallet[this.typePacking].wrong_process_finished, 2000, this.pickingProvider.colorsMessage.error.name);
        } else {
          this.postVerifyPacking({
            status: 3,
            pickingId: this.pickingId,
            packingReference: this.jailReference
          })
            .subscribe((res) => {
              this.inputPicking = null;
              this.presentToast('Proceso finalizado correctamente.', 1500, this.pickingProvider.colorsMessage.success.name);
              this.showTextEndScanPacking(false, this.typePacking, this.jailReference);
              setTimeout(() => {
                this.location.back();
                this.events.publish('picking:remove');
              }, 1.5 * 1000);
            }, (error) => {
              this.inputPicking = null;
              if (error.error.code == 404) {
                this.presentToast(this.literalsJailPallet[this.typePacking].not_registered, 2000, this.pickingProvider.colorsMessage.error.name);
              } else {
                this.presentToast(error.error.errors, 2000, this.pickingProvider.colorsMessage.error.name);
              }
            });
        }
      } else if (dataWrited != this.lastCodeScanned && dataWrited.match(/([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/)) {
        if (!this.processInitiated) {
          this.inputPicking = null;
          this.presentToast(this.literalsJailPallet[this.typePacking].scan_before_products, 2000, this.pickingProvider.colorsMessage.error.name);
        } else {
          this.lastCodeScanned = dataWrited;
          if (this.listProducts.length > 0) {
            let picking: InventoryModel.Picking = {
              packingReference: this.jailReference,
              packingType: this.typePacking,
              pikingId: this.pickingId,
              productReference: dataWrited
            };
            this.inventoryService
              .postPicking(picking)
              .subscribe((res: InventoryModel.ResponsePicking) => {
                if (res.code == 200 || res.code == 201) {
                  this.listProducts = res.data.shoePickingPending;
                  this.productsScanned.push(dataWrited);
                  this.inputPicking = null;
                  this.presentToast(`Producto ${dataWrited} escaneado y añadido ${this.literalsJailPallet[this.typePacking].toThe}.`, 2000, this.pickingProvider.colorsMessage.info.name);
                  if (this.listProducts.length > 0) {
                    this.setNexProductToScan(this.listProducts[0]);
                  } else {
                    this.showNexProductToScan(false);
                    setTimeout(() => {
                      this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                      this.dataToWrite = 'CONTENEDOR';
                      this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                    }, 2 * 1000);
                  }
                } else {
                  this.inputPicking = null;
                  this.presentToast(res.message, 2000, this.pickingProvider.colorsMessage.error.name);
                  this.getPendingListByPicking(this.pickingId)
                    .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                      if (res.code == 200 || res.code == 201) {
                        this.listProducts = res.data;
                        if (this.listProducts.length > 0) {
                          this.setNexProductToScan(this.listProducts[0]);
                        } else {
                          this.showNexProductToScan(false);
                          setTimeout(() => {
                            this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                            this.dataToWrite = 'CONTENEDOR';
                            this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                          }, 2 * 1000);
                        }
                      }
                    });
                }
              }, (error) => {
                this.inputPicking = null;
                this.presentToast(error.error.errors, 2000, this.pickingProvider.colorsMessage.error.name);
                this.getPendingListByPicking(this.pickingId)
                  .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                    if (res.code == 200 || res.code == 201) {
                      this.listProducts = res.data;
                      if (this.listProducts.length > 0) {
                        this.setNexProductToScan(this.listProducts[0]);
                      } else {
                        this.showNexProductToScan(false);
                        setTimeout(() => {
                          this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                          this.dataToWrite = 'CONTENEDOR';
                          this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                        }, 2 * 1000);
                      }
                    }
                  });
              });
          } else {
            this.inputPicking = null;
            this.showNexProductToScan(false);
            this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
            this.dataToWrite = 'CONTENEDOR';
            this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
          }
        }
      } else {
        if (this.processInitiated) {
          this.inputPicking = null;
        } else {
          this.inputPicking = null;
          this.presentToast('Referencia errónea', 1500, this.pickingProvider.colorsMessage.error.name);
        }
      }
    }
  }

  private postVerifyPacking(packing) : Observable<PickingModel.ResponseUpdate> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<PickingModel.ResponseUpdate>(this.postVerifyPackingUrl, packing, { headers });
    }));
  }

  private getPendingListByPicking(pickingId: number) : Observable<ShoesPickingModel.ResponseListByPicking> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.get<ShoesPickingModel.ResponseListByPicking>(this.getPendingListByPickingUrl.replace('{{id}}', pickingId.toString()), { headers });
    }));
  }

  private putProductNotFound(pickingId: number, productId: number) : Observable<ShoesPickingModel.ResponseProductNotFound> {
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      let putProductNotFoundUrl = this.putProductNotFoundUrl.replace('{{workWaveOrderId}}', pickingId.toString());
      putProductNotFoundUrl = putProductNotFoundUrl.replace('{{productId}}', productId.toString());
      return this.http.put<ShoesPickingModel.ResponseProductNotFound>(putProductNotFoundUrl, { headers });
    }));
  }

  private setNexProductToScan(nextProduct: ShoesPickingModel.ShoesPicking) {
    this.nexProduct = nextProduct;
  }

  private showNexProductToScan(show: boolean) {
    if (show) {

    } else {
      this.nexProduct = null;
    }
  }

  private showTextStartScanPacking(show: boolean, typePacking: number, packingReference?: string) {
    if (show) {
      if (typePacking == 1) {
        if (packingReference) {
          this.scanJail = "Escanea la Jaula " + packingReference + " para continuar con el proceso de picking ya iniciado.";
        } else {
          this.scanJail = "Escanea una Jaula para dar comienzo al proceso de picking.";
        }
      } else {
        if (packingReference) {
          this.scanJail = "Escanea el Pallet " + packingReference + " para continuar con el proceso de picking ya iniciado.";
        } else {
          this.scanJail = "Escanea un Pallet para dar comienzo al proceso de picking.";
        }
      }
    } else {
      this.scanJail = null;
    }
  }

  private showTextEndScanPacking(show: boolean, typePacking: number, packingReference: string) {
    if (show) {
      if (typePacking == 1) {
        this.scanJail = "Escanea la Jaula " + packingReference + " para finalizar el proceso de picking.";
      } else {
        this.scanJail = "Escanea el Pallet " + packingReference + " para finalizar el proceso de picking.";
      }
    } else {
      this.scanJail = null;
    }
  }

  oldReference(inventory: ShoesPickingModel.Inventory) {
    let alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    return 'P' + inventory.rack.hall.toString().padStart(2, '0')
      + alphabet[inventory.container.row-1]
      + inventory.container.column.toString().padStart(2, '0');
  }

  async productNotFound() {
    const alertWarning = await this.alertController.create({
      header: 'Atención',
      subHeader: '¿Está seguro de querer reportar como no encontrado el producto '+this.nexProduct.product.model.reference+' en la ubicación '+this.nexProduct.inventory.container.reference+'?',
      backdropDismiss: false,
      buttons: [
        'Cancelar',
        {
          text: 'Reportar',
          handler: () => {
            let productNotFoundId = this.nexProduct.product.id;
            this.putProductNotFound(this.pickingId, productNotFoundId)
              .subscribe((res: ShoesPickingModel.ResponseProductNotFound) => {
                if (res.code == 200 || res.code == 201) {
                  this.presentToast('El producto ha sido reportado como no encontrado', 1500, this.pickingProvider.colorsMessage.success.name);
                  this.getPendingListByPicking(this.pickingId)
                    .subscribe((res: ShoesPickingModel.ResponseListByPicking) => {
                      if (res.code == 200 || res.code == 201) {
                        this.listProducts = res.data;
                        if (this.listProducts.length > 0) {
                          this.setNexProductToScan(this.listProducts[0]);
                        } else {
                          this.showNexProductToScan(false);
                          setTimeout(() => {
                            this.showTextEndScanPacking(true, this.typePacking, this.jailReference);
                            this.dataToWrite = 'CONTENEDOR';
                            this.presentToast(this.literalsJailPallet[this.typePacking].scan_to_end, 1500, this.pickingProvider.colorsMessage.success.name);
                          }, 2 * 1000);
                        }

                      }
                    });
                } else {
                  this.presentToast('Ha ocurrido un error al intentar reportar el producto como no encontrado.', 2000, this.pickingProvider.colorsMessage.error.name);
                }
              }, error => {
                this.presentToast('Ha ocurrido un error al intentar reportar el producto como no encontrado.', 2000, this.pickingProvider.colorsMessage.error.name);
              });
          }
        }]
    });

    return await alertWarning.present();
  }

  private async presentToast(msg: string, duration: number = 2000, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: duration,
      color: color
    });

    toast.present();
  }
}
