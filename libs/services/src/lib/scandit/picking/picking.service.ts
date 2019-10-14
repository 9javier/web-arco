import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {PickingProvider} from "../../../providers/picking/picking.provider";
import {PickingStoreService} from "../../endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../models/endpoints/PickingStore";
import {StoresLineRequestsModel} from "../../../models/endpoints/StoresLineRequests";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {Events} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PickingScanditService {

  private timeoutHideText;
  private packingReferences: string[] = [];

  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private events: Events,
    private pickingStoreService: PickingStoreService,
    private scanditProvider: ScanditProvider,
    private pickingProvider: PickingProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  async picking() {
    let filtersToGetProducts: PickingStoreModel.ParamsFiltered = {
      orderbys: [],
      sizes: [],
      colors: [],
      models: [],
      brands: []
    };
    let listProductsToStorePickings = this.pickingProvider.listProductsToStorePickings;
    let listProductsProcessed = this.pickingProvider.listProductsProcessedToStorePickings;
    let listRejectionReasons = this.pickingProvider.listRejectionReasonsToStorePickings;
    let lastCodeScanned: string = 'start';
    let typePacking: number = 1;
    let scannerPaused: boolean = false;
    let scanMode = 'products';
    let filtersPicking = this.pickingProvider.listFiltersPicking;
    let timeoutStarted = null;

    const textPickingStoresInit = listProductsToStorePickings.length == 0 ? this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end : 'Escanea los productos a incluir';

    ScanditMatrixSimple.initPickingStores((response: ScanditModel.ResponsePickingStores) => {
      if (!scannerPaused && response.result) {
        if (response.barcode && response.barcode.data && lastCodeScanned != response.barcode.data) {
          let codeScanned = response.barcode.data;
          if(scanMode == 'products'){
            if(this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT){
              lastCodeScanned = codeScanned;

              if (timeoutStarted) {
                clearTimeout(timeoutStarted);
              }
              timeoutStarted = setTimeout(() => lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

              if (listProductsToStorePickings.length > 0) {
                let paramsPickingStoreProcess: PickingStoreModel.SendProcess = {
                  productReference: codeScanned,
                  filters: filtersToGetProducts
                };
                ScanditMatrixSimple.showLoadingDialog('Comprobando producto...');
                this.pickingStoreService
                  .postPickingStoreProcess(paramsPickingStoreProcess)
                  .then((res: PickingStoreModel.ResponseSendProcess) => {
                    ScanditMatrixSimple.hideLoadingDialog();
                    if (res.code == 200 || res.code == 201) {
                      listProductsToStorePickings = res.data.linesRequestFiltered.pending;
                      listProductsProcessed = res.data.linesRequestFiltered.processed;
                      ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                      ScanditMatrixSimple.setText(
                        `Producto ${codeScanned} escaneado y añadido al picking.`,
                        this.scanditProvider.colorsMessage.info.color,
                        this.scanditProvider.colorText.color,
                        18);
                      this.hideTextMessage(2000);
                      if (listProductsToStorePickings.length < 1) {
                        setTimeout(() => {
                          ScanditMatrixSimple.setText(
                            `No hay más productos pendientes de añadir al picking.`,
                            this.scanditProvider.colorsMessage.info.color,
                            this.scanditProvider.colorText.color,
                            16);
                          this.hideTextMessage(2000);
                          ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end);
                        }, 2 * 1000);
                      }
                      this.refreshListPickingsStores();
                    } else {
                      ScanditMatrixSimple.setText(
                        res.errors,
                        this.scanditProvider.colorsMessage.error.color,
                        this.scanditProvider.colorText.color,
                        18);
                      this.hideTextMessage(2000);
                      this.loadLineRequestsPending(listProductsToStorePickings, listProductsProcessed, filtersToGetProducts, typePacking);
                    }
                  }, (error) => {
                    ScanditMatrixSimple.hideLoadingDialog();
                    ScanditMatrixSimple.setText(
                      error.error.errors,
                      this.scanditProvider.colorsMessage.error.color,
                      this.scanditProvider.colorText.color,
                      18);
                    this.hideTextMessage(2000);
                    this.loadLineRequestsPending(listProductsToStorePickings, listProductsProcessed, filtersToGetProducts, typePacking);
                  })
                  .catch((error) => {
                    ScanditMatrixSimple.hideLoadingDialog();
                    ScanditMatrixSimple.setText(
                      error.error.errors,
                      this.scanditProvider.colorsMessage.error.color,
                      this.scanditProvider.colorText.color,
                      18);
                    this.hideTextMessage(2000);
                    this.loadLineRequestsPending(listProductsToStorePickings, listProductsProcessed, filtersToGetProducts, typePacking);
                  });
              } else {
                ScanditMatrixSimple.setText(
                  this.pickingProvider.literalsJailPallet[typePacking].scan_to_end,
                  this.scanditProvider.colorsMessage.success.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(2000);
              }
            } else {
              ScanditMatrixSimple.setText(
                `Escanee un producto válido`,
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(2000);
            }
          } else if (scanMode == 'carriers') {
            if (this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.JAIL
              || this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PALLET) {
              ScanditMatrixSimple.showLoadingDialog('Cargando embalaje...');
              setTimeout(() => {
                ScanditMatrixSimple.hideLoadingDialog();
                this.packingReferences.push(codeScanned);
                ScanditMatrixSimple.setText(
                  `Escaneado embalaje ${codeScanned} para añadir al picking`,
                  this.scanditProvider.colorsMessage.info.color,
                  this.scanditProvider.colorText.color,
                  18);
                this.hideTextMessage(2000);
              }, 0.5 * 1000);
            } else {
              ScanditMatrixSimple.setText(
                `Escanee un embalaje válido`,
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(2000);
            }
          } else if (scanMode == 'products_disassociate') {
            if(this.scanditProvider.checkCodeValue(codeScanned) == this.scanditProvider.codeValue.PRODUCT) {
              ScanditMatrixSimple.showLoadingDialog('Desasociando artículo del picking actual...');
              this.pickingStoreService
                .postLineRequestDisassociate({
                  filters: filtersToGetProducts,
                  productReference: codeScanned
                })
                .then((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
                  let resData: PickingStoreModel.ResponseDataLineRequestsFiltered = res.data;
                  listProductsToStorePickings = resData.pending;
                  listProductsProcessed = resData.processed;
                  ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                  this.refreshListPickingsStores();

                  ScanditMatrixSimple.hideLoadingDialog();
                  ScanditMatrixSimple.setText(
                    'El artículo ha sido desasociado del picking actual.',
                    this.scanditProvider.colorsMessage.success.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(2000);
                }, (error) => {
                  console.error('Error::Subscribe::pickingStoreService::postLineRequestDisassociate', error);
                  ScanditMatrixSimple.hideLoadingDialog();
                  ScanditMatrixSimple.setText(
                    'Ha ocurrido un error al intentar desasociar el artículo del picking actual.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(2000);
                })
                .catch((error) => {
                  console.error('Error::Subscribe::pickingStoreService::postLineRequestDisassociate', error);
                  ScanditMatrixSimple.hideLoadingDialog();
                  ScanditMatrixSimple.setText(
                    'Ha ocurrido un error al intentar desasociar el artículo del picking actual.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(2000);
                });
            } else {
              ScanditMatrixSimple.setText(
                `Escanee un producto válido`,
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(2000);
            }
          }
        } else {
          if (response.action == 'matrix_simple') {
            ScanditMatrixSimple.showLoadingDialog('Cargando productos...');
            setTimeout(() => {
              ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, filtersPicking);
              ScanditMatrixSimple.sendPickingStoresRejectionReasons(listRejectionReasons);
            }, 1 * 1000);
            if (listProductsToStorePickings.length < 1) {
              ScanditMatrixSimple.setText(
                `No hay más productos pendientes de añadir al picking.`,
                this.scanditProvider.colorsMessage.info.color,
                this.scanditProvider.colorText.color,
                16);
              this.hideTextMessage(2000);
              ScanditMatrixSimple.hideLoadingDialog();
              ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end);
            }
          } else if (response.action == 'matrix_simple_scan_packings') {
            ScanditMatrixSimple.showButtonPickingStorePacking(false);
            ScanditMatrixSimple.showButtonPickingStoreFinish(true);
            ScanditMatrixSimple.setTextPickingStores(true, `Escanee los embalajes a usar`);
            scanMode = 'carriers';
            this.packingReferences = [];
          } else if (response.action == 'matrix_simple_finish_picking') {
            if(this.packingReferences.length == 0){
              ScanditMatrixSimple.setText(
                `Añada al menos un embalaje al picking`,
                this.scanditProvider.colorsMessage.error.color,
                this.scanditProvider.colorText.color,
                18);
              this.hideTextMessage(2000);
            } else {
              ScanditMatrixSimple.showWarning(true, '¿Le han quedado productos sin poder añadir a alguno de los embalajes escaneados? Si es así escanéelos para desasociarlos del picking actual.', 'products_out_of_packing', 'Finalizar', 'Escanear productos');
            }
          } else if (response.action == 'filters') {
            filtersToGetProducts = {
              models: response.filters.model.map(filter => {
                return filter.id;
              }),
              brands: response.filters.brand.map(filter => {
                return filter.id;
              }),
              colors: response.filters.color.map(filter => {
                return filter.id;
              }),
              sizes: response.filters.size.map(filter => {
                return filter.name;
              }),
              orderbys: response.filters.sort.map(filter => {
                return {
                  type: filter.id,
                  order: filter.type_sort.toLowerCase()
                };
              })
            };
            ScanditMatrixSimple.showLoadingDialog('Cargando productos...');
            this.pickingStoreService
              .postLineRequestFiltered(filtersToGetProducts)
              .then((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
                ScanditMatrixSimple.hideLoadingDialog();
                if (res.code == 200) {
                  listProductsToStorePickings = res.data.pending;
                  listProductsProcessed = res.data.processed;
                  ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                  this.refreshListPickingsStores();
                }
              }, () => ScanditMatrixSimple.hideLoadingDialog()).catch(() => ScanditMatrixSimple.hideLoadingDialog());
          } else if (response.action == 'request_reject') {
            ScanditMatrixSimple.showLoadingDialog('Rechazando artículo del picking...');

            let reasonId = response.reasonId;
            let requestReference = response.requestReference;

            this.pickingStoreService
              .postRejectRequest({
                filters: filtersToGetProducts,
                reasonRejectionId: reasonId,
                reference: requestReference
              })
              .then((res: PickingStoreModel.ResponseRejectRequest) => {
                let resData: PickingStoreModel.RejectRequest = res.data;
                listProductsToStorePickings = resData.linesRequestFiltered.pending;
                listProductsProcessed = resData.linesRequestFiltered.processed;
                ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                this.refreshListPickingsStores();

                ScanditMatrixSimple.hideLoadingDialog();
                ScanditMatrixSimple.setText(
                  'El artículo ha sido rechazado del picking actual.',
                  this.scanditProvider.colorsMessage.success.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(2000);
                ScanditMatrixSimple.hideInfoProductDialog();
              }, (error) => {
                console.error('Error::Subscribe::pickingStoreService::postRejectRequest', error);
                ScanditMatrixSimple.hideLoadingDialog();
                ScanditMatrixSimple.setText(
                  'Ha ocurrido un error al intentar rechazar el artículo en el picking actual.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(2000);
              })
              .catch((error) => {
                console.error('Error::Subscribe::pickingStoreService::postRejectRequest', error);
                ScanditMatrixSimple.hideLoadingDialog();
                ScanditMatrixSimple.setText(
                  'Ha ocurrido un error al intentar rechazar el artículo en el picking actual.',
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(2000);
              });
          } else if (response.action == 'products_out_of_packing') {
            if (response.response) {
              this.finishPicking();
            } else {
              ScanditMatrixSimple.setTextPickingStores(true, 'Escanee los productos a desasociar');
              scanMode = 'products_disassociate';
            }
          }
        }
      }
    }, 'Picking', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color, textPickingStoresInit, environment.urlBase);
  }

  private loadLineRequestsPending(listProductsToStorePickings: StoresLineRequestsModel.LineRequests[], listProductsProcessed: StoresLineRequestsModel.LineRequests[], filtersToGetProducts: PickingStoreModel.ParamsFiltered, typePacking: number) {
    ScanditMatrixSimple.showLoadingDialog('Consultando productos restantes...');
    this.pickingStoreService
      .postLineRequestFiltered(filtersToGetProducts)
      .then((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
        ScanditMatrixSimple.hideLoadingDialog();
        if (res.code == 200 || res.code == 201) {
          listProductsToStorePickings = res.data.pending;
          listProductsProcessed = res.data.processed;
          ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
          if (listProductsToStorePickings.length < 1) {
            setTimeout(() => {
              ScanditMatrixSimple.setText(
                `No hay más productos pendientes de añadir al picking.`,
                this.scanditProvider.colorsMessage.info.color,
                this.scanditProvider.colorText.color,
                16);
              this.hideTextMessage(2000);
              ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].scan_packings_to_end);
            }, 2 * 1000);
          }
          this.refreshListPickingsStores();
        }
      }, () => ScanditMatrixSimple.hideLoadingDialog()).catch(() => ScanditMatrixSimple.hideLoadingDialog());
  }

  private finishPicking() {
    ScanditMatrixSimple.showLoadingDialog('Finalizando proceso...');
    ScanditMatrixSimple.setText(
      'Finalizando proceso...',
      this.scanditProvider.colorsMessage.info.color,
      this.scanditProvider.colorText.color,
      18);
    this.hideTextMessage(2000);
    this.pickingStoreService
      .postPackings({
        packingReferences: this.packingReferences
      })
      .then((res: PickingStoreModel.ResponsePostPacking) => {
        ScanditMatrixSimple.hideLoadingDialog();
        if (res.code == 200 || res.code == 201) {
          ScanditMatrixSimple.finishPickingStores();
          this.refreshListPickingsStores();
        } else {
          ScanditMatrixSimple.setText(
            res.errors,
            this.scanditProvider.colorsMessage.error.color,
            this.scanditProvider.colorText.color,
            18);
          this.hideTextMessage(2000);
          this.packingReferences = [];
          ScanditMatrixSimple.setTextPickingStores(true, `Escanee de nuevo los embalajes a usar`);
        }
      }, (error) => {
        ScanditMatrixSimple.hideLoadingDialog();
        ScanditMatrixSimple.setText(
          error.error.errors,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          18);
        this.hideTextMessage(2000);
        this.packingReferences = [];
        ScanditMatrixSimple.setTextPickingStores(true, `Escanee de nuevo los embalajes a usar`);
      })
      .catch((error) => {
        ScanditMatrixSimple.hideLoadingDialog();
        ScanditMatrixSimple.setText(
          error.error.errors,
          this.scanditProvider.colorsMessage.error.color,
          this.scanditProvider.colorText.color,
          18);
        this.hideTextMessage(2000);
        this.packingReferences = [];
        ScanditMatrixSimple.setTextPickingStores(true, `Escanee de nuevo los embalajes a usar`);
      });
  }

  private refreshListPickingsStores() {
    this.events.publish('picking-stores:refresh');
  }

  private hideTextMessage(delay: number) {
    if(this.timeoutHideText){
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }

}
