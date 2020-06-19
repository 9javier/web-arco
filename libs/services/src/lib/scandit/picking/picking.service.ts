import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {PickingProvider} from "../../../providers/picking/picking.provider";
import {PickingStoreService} from "../../endpoint/picking-store/picking-store.service";
import {PickingStoreModel} from "../../../models/endpoints/PickingStore";
import {ScanditModel} from "../../../models/scandit/Scandit";
import {Events} from "@ionic/angular";
import {environment} from "../../../environments/environment";
import {environment as al_environment} from "../../../../../../apps/al/src/environments/environment";
import {ItemReferencesProvider} from "../../../providers/item-references/item-references.provider";
import ListItem = PickingStoreModel.ListItem;
import {TimesToastType} from "../../../models/timesToastType";
import {IntermediaryService} from "@suite/services";
import {PositionsToast} from "../../../models/positionsToast.type";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PickingScanditService {

  private timeoutHideText;
  private packingReferences: string[];

  private packing: boolean;
  private readonly timeMillisToResetScannedCode: number = 1000;
  private lastCodeScanned: string;

  private processed;

  constructor(
    private events: Events,
    private pickingStoreService: PickingStoreService,
    private scanditProvider: ScanditProvider,
    private pickingProvider: PickingProvider,
    private itemReferencesProvider: ItemReferencesProvider,
    private intermediaryService: IntermediaryService,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
  }

  async picking(packing?: boolean) {
    let filtersToGetProducts: PickingStoreModel.ParamsFiltered = {
      orderbys: [],
      sizes: [],
      colors: [],
      models: [],
      brands: []
    };
    let listProductsToStorePickings: ListItem[] = this.pickingProvider.listProductsToStorePickings;
    let listProductsProcessed: ListItem[] = this.pickingProvider.listProductsProcessedToStorePickings;
    let listRejectionReasons = this.pickingProvider.listRejectionReasonsToStorePickings;
    this.lastCodeScanned = 'start';
    this.processed = listProductsProcessed;
    this.packingReferences = [];
    this.packing = false;
    let typePacking: number = 1;
    let scannerPaused: boolean = false;
    let scanMode = 'products';
    let filtersPicking = this.pickingProvider.listFiltersPicking;
    let timeoutStarted = null;

    let textPickingStoresInit: string;
    if(packing){
      this.packing = true;
      textPickingStoresInit = 'Escanee los embalajes a usar';
      scanMode = 'carriers';
    }else{
      textPickingStoresInit = listProductsToStorePickings.length == 0 ? this.pickingProvider.literalsJailPallet[typePacking].press_scan_packings_to_continue : 'Escanea los productos a incluir';
    }

    ScanditMatrixSimple.initPickingStores((response: ScanditModel.ResponsePickingStores) => {
        if (response && response.result && response.actionIonic) {
          this.executeAction(response.actionIonic, response.params);
        } else if (!scannerPaused && response.result) {
          if (response.barcode && response.barcode.data && this.lastCodeScanned != response.barcode.data) {
            let codeScanned = response.barcode.data;
            if (scanMode == 'products') {
              if (this.itemReferencesProvider.checkCodeValue(codeScanned) == this.itemReferencesProvider.codeValue.PRODUCT) {
                this.lastCodeScanned = codeScanned;
                ScanditMatrixSimple.setTimeout("lastCodeScannedStart", this.timeMillisToResetScannedCode, "");

                if (listProductsToStorePickings.length > 0) {
                  let paramsPickingStoreProcess: PickingStoreModel.SendProcess = {
                    productReference: codeScanned
                  };
                  ScanditMatrixSimple.showLoadingDialog('Comprobando producto...');
                  this.pickingStoreService
                    .postPickingStoreProcess(paramsPickingStoreProcess)
                    .then((res: PickingStoreModel.ResponseSendProcess) => {
                      ScanditMatrixSimple.hideLoadingDialog();
                      if (res.code == 200 || res.code == 201) {

                        const processedRequest: ListItem = res.data;
                        //delete processed request from pending requests
                        for(let index = 0; index < listProductsToStorePickings.length; index++){
                          if(listProductsToStorePickings[index].id == processedRequest.id && listProductsToStorePickings[index].shippingMode == processedRequest.shippingMode){
                            processedRequest.model = listProductsToStorePickings[index].model;
                            processedRequest.size = listProductsToStorePickings[index].size;
                            listProductsToStorePickings.splice(index, 1);
                            break;
                          }
                        }
                        //add processed request to processed requests
                        listProductsProcessed.push(processedRequest);

                        if(this.packing){
                          ScanditMatrixSimple.sendPickingStoresProducts(this.packingReferences, listProductsProcessed, null);
                        }else{
                          ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                        }
                        ScanditMatrixSimple.setText(
                          `Producto ${codeScanned} escaneado y añadido al traspaso.`,
                          this.scanditProvider.colorsMessage.info.color,
                          this.scanditProvider.colorText.color,
                          18);
                        this.hideTextMessage(2000);
                        if (listProductsToStorePickings.length < 1) {
                          ScanditMatrixSimple.setTimeout("setNotProductPending", 2 * 1000, JSON.stringify([typePacking]));
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
              ScanditMatrixSimple.hideLoadingDialog();
              if (this.itemReferencesProvider.checkCodeValue(codeScanned) == this.itemReferencesProvider.codeValue.PACKING) {
                if(this.packingReferences.includes(codeScanned)){
                  ScanditMatrixSimple.setText(
                    `Ya ha escaneado ese embalaje.`,
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    18);
                  this.hideTextMessage(2000);
                }else{
                  ScanditMatrixSimple.showLoadingDialog('Cargando embalaje...');
                  ScanditMatrixSimple.setTimeout("scannedPacking", 1000, JSON.stringify([codeScanned]));
                }
              } else {
                ScanditMatrixSimple.setText(
                  `Escanee un embalaje válido`,
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  18);
                this.hideTextMessage(2000);
              }
            } else if (scanMode == 'products_disassociate') {
              if (this.itemReferencesProvider.checkCodeValue(codeScanned) == this.itemReferencesProvider.codeValue.PRODUCT) {
                ScanditMatrixSimple.showLoadingDialog('Desasociando artículo del traspaso actual...');
                this.pickingStoreService
                  .postLineRequestDisassociate({
                    filters: filtersToGetProducts,
                    productReference: codeScanned
                  })
                  .then((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
                    let resData: PickingStoreModel.ResponseDataLineRequestsFiltered = res.data;
                    listProductsToStorePickings = resData.pending;
                    listProductsProcessed = resData.processed;
                    if(this.packing){
                      ScanditMatrixSimple.sendPickingStoresProducts(this.packingReferences, listProductsProcessed, null);
                    }else{
                      ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                    }
                    this.refreshListPickingsStores();

                    ScanditMatrixSimple.hideLoadingDialog();
                    ScanditMatrixSimple.setText(
                      'El artículo ha sido desasociado del traspaso actual.',
                      this.scanditProvider.colorsMessage.success.color,
                      this.scanditProvider.colorText.color,
                      16);
                    this.hideTextMessage(2000);
                  }, (error) => {
                    console.error('Error::Subscribe::pickingStoreService::postLineRequestDisassociate', error);
                    ScanditMatrixSimple.hideLoadingDialog();
                    ScanditMatrixSimple.setText(
                      'Ha ocurrido un error al intentar desasociar el artículo del traspaso actual.',
                      this.scanditProvider.colorsMessage.error.color,
                      this.scanditProvider.colorText.color,
                      16);
                    this.hideTextMessage(2000);
                  })
                  .catch((error) => {
                    console.error('Error::Subscribe::pickingStoreService::postLineRequestDisassociate', error);
                    ScanditMatrixSimple.hideLoadingDialog();
                    ScanditMatrixSimple.setText(
                      'Ha ocurrido un error al intentar desasociar el artículo del traspaso actual.',
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
              if(scanMode != 'carriers') ScanditMatrixSimple.showLoadingDialog('Cargando productos...');
              ScanditMatrixSimple.setTimeout("loadProducts", 1 * 1000, JSON.stringify([listProductsToStorePickings, listProductsProcessed, filtersPicking, listRejectionReasons]));
              if (listProductsToStorePickings.length < 1) {
                ScanditMatrixSimple.setText(
                  `No hay más productos pendientes de añadir al traspaso.`,
                  this.scanditProvider.colorsMessage.info.color,
                  this.scanditProvider.colorText.color,
                  16);
                this.hideTextMessage(2000);
                ScanditMatrixSimple.hideLoadingDialog();
                ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].press_scan_packings_to_continue);
              }
            } else if (response.action == 'matrix_simple_scan_packings') {
              ScanditMatrixSimple.showButtonPickingStorePacking(false);
              ScanditMatrixSimple.showButtonPickingStoreFinish(true);
              ScanditMatrixSimple.setTextPickingStores(true, `Escanee los embalajes a usar`);
              scanMode = 'carriers';
              this.packingReferences = [];
            } else if (response.action == 'matrix_simple_finish_picking') {
              if (this.packingReferences.length == 0) {
                ScanditMatrixSimple.setText(
                  `Añada al menos un embalaje al picking`,
                  this.scanditProvider.colorsMessage.error.color,
                  this.scanditProvider.colorText.color,
                  18);
                this.hideTextMessage(2000);
              } else {
                ScanditMatrixSimple.showWarning(true, '¿Le han quedado productos sin poder añadir a alguno de los embalajes escaneados? Si es así escanéelos para desasociarlos del traspaso actual.', 'products_out_of_packing', 'Finalizar', 'Escanear productos');
              }
            } else if (response.action == 'matrix_simple_finish') {
              if(scanMode == 'carriers'){
                if (this.packingReferences.length == 0) {
                  ScanditMatrixSimple.setText(
                    `Añada al menos un embalaje al picking`,
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    18);
                  this.hideTextMessage(2000);
                } else {
                  ScanditMatrixSimple.showWarning(true, '¿Le han quedado productos sin poder añadir a alguno de los embalajes escaneados? Si es así escanéelos para desasociarlos del traspaso actual.', 'products_out_of_packing', 'Finalizar', 'Escanear productos');
                }
              }else{
                ScanditMatrixSimple.finishPickingStores();
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
              const typesFiltered = response.filters.type.map(filter => {
                return filter.id;
              });
              if(scanMode != 'carriers') ScanditMatrixSimple.showLoadingDialog('Cargando productos...');
              if(typesFiltered.length == 0 || (typesFiltered.length > 0 && typesFiltered.includes(1))){
                this.pickingStoreService
                  .postLineRequestFiltered(filtersToGetProducts)
                  .then((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
                    ScanditMatrixSimple.hideLoadingDialog();
                    if (res.code == 200) {
                      listProductsToStorePickings = res.data.pending;
                      listProductsProcessed = res.data.processed;
                      if(this.packing){
                        ScanditMatrixSimple.sendPickingStoresProducts(this.packingReferences, listProductsProcessed, null);
                      }else{
                        ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                      }
                      this.refreshListPickingsStores();
                    }
                  }, () => ScanditMatrixSimple.hideLoadingDialog()).catch(() => ScanditMatrixSimple.hideLoadingDialog());
              }else{
                listProductsToStorePickings = [];
                listProductsProcessed = [];

                ScanditMatrixSimple.hideLoadingDialog();

                if(this.packing){
                  ScanditMatrixSimple.sendPickingStoresProducts(this.packingReferences, listProductsProcessed, null);
                }else{
                  ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                }
                this.refreshListPickingsStores();
              }
            } else if (response.action == 'request_reject') {
              ScanditMatrixSimple.showLoadingDialog('Rechazando artículo del traspaso...');

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
                  if(this.packing){
                    ScanditMatrixSimple.sendPickingStoresProducts(this.packingReferences, listProductsProcessed, null);
                  }else{
                    ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
                  }
                  this.refreshListPickingsStores();

                  ScanditMatrixSimple.hideLoadingDialog();
                  ScanditMatrixSimple.setText(
                    'El artículo ha sido rechazado del traspaso actual.',
                    this.scanditProvider.colorsMessage.success.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(2000);
                  ScanditMatrixSimple.hideInfoProductDialog();
                }, (error) => {
                  console.error('Error::Subscribe::pickingStoreService::postRejectRequest', error);
                  ScanditMatrixSimple.hideLoadingDialog();
                  ScanditMatrixSimple.setText(
                    'Ha ocurrido un error al intentar rechazar el artículo en el traspaso actual.',
                    this.scanditProvider.colorsMessage.error.color,
                    this.scanditProvider.colorText.color,
                    16);
                  this.hideTextMessage(2000);
                })
                .catch((error) => {
                  console.error('Error::Subscribe::pickingStoreService::postRejectRequest', error);
                  ScanditMatrixSimple.hideLoadingDialog();
                  ScanditMatrixSimple.setText(
                    'Ha ocurrido un error al intentar rechazar el artículo en el traspaso actual.',
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

  private loadLineRequestsPending(listProductsToStorePickings: ListItem[], listProductsProcessed: ListItem[], filtersToGetProducts: PickingStoreModel.ParamsFiltered, typePacking: number) {
    ScanditMatrixSimple.showLoadingDialog('Consultando productos restantes...');
    this.pickingStoreService
      .postLineRequestFiltered(filtersToGetProducts)
      .then((res: PickingStoreModel.ResponseLineRequestsFiltered) => {
        ScanditMatrixSimple.hideLoadingDialog();
        if (res.code == 200 || res.code == 201) {
          listProductsToStorePickings = res.data.pending;
          listProductsProcessed = res.data.processed;
          if(this.packing){
            ScanditMatrixSimple.sendPickingStoresProducts(this.packingReferences, listProductsProcessed, null);
          }else{
            ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, null);
          }
          if (listProductsToStorePickings.length < 1) {
            ScanditMatrixSimple.setTimeout("setNotProductPending",  2 * 1000, JSON.stringify([typePacking]));
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
      .then(async (res: PickingStoreModel.ResponsePostPacking) => {
        ScanditMatrixSimple.hideLoadingDialog();
        if (res.code == 200 || res.code == 201) {
          ScanditMatrixSimple.finishPickingStores();
          this.refreshListPickingsStores();
          await this.intermediaryService.presentToastSuccess('Finalizada correctamente la asociación de pares a embalajes', TimesToastType.DURATION_SUCCESS_TOAST_4550, PositionsToast.BOTTOM);
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
    ScanditMatrixSimple.setTimeout("hideText", delay, "");
  }

  private executeAction(action: string, paramsString: string){
    let params = [];
    try{
      params = JSON.parse(paramsString);
    } catch (e) {

    }
    switch (action){
      case 'lastCodeScannedStart':
        this.lastCodeScanned = 'start';
        break;
      case 'setNotProductPending':
        let typePacking = params[0];
        ScanditMatrixSimple.setText(
          `No hay más productos pendientes de añadir al traspaso.`,
          this.scanditProvider.colorsMessage.info.color,
          this.scanditProvider.colorText.color,
          16);
        this.hideTextMessage(2000);
        ScanditMatrixSimple.setTextPickingStores(true, this.pickingProvider.literalsJailPallet[typePacking].press_scan_packings_to_continue);
        break;
      case 'scannedPacking':
        let codeScanned = params[0];
        ScanditMatrixSimple.hideLoadingDialog();
        this.packingReferences.push(codeScanned);
        let scannedPackings: {
          reference: string
        }[] = [];
        for(let ref of this.packingReferences){
          if(!scannedPackings.map(s=>s.reference).includes(ref)){
            scannedPackings.push({reference: ref});
          }
        }
        ScanditMatrixSimple.sendPickingStoresProducts(scannedPackings, this.processed, null);
        ScanditMatrixSimple.setText(
          `Escaneado embalaje ${codeScanned} para añadir al traspaso`,
          this.scanditProvider.colorsMessage.info.color,
          this.scanditProvider.colorText.color,
          18);
        this.hideTextMessage(2000);
        break;
      case 'loadProducts':
        let listProductsToStorePickings = params[0];
        let listProductsProcessed = params[1];
        let filtersPicking = params[2];
        let listRejectionReasons = params[3];
        if(this.packing){
          ScanditMatrixSimple.sendPickingStoresProducts(this.packingReferences, listProductsProcessed, filtersPicking);
        }else{
          ScanditMatrixSimple.sendPickingStoresProducts(listProductsToStorePickings, listProductsProcessed, filtersPicking);
        }
        ScanditMatrixSimple.sendPickingStoresRejectionReasons(listRejectionReasons);
        break;
      case 'hideText':
        ScanditMatrixSimple.showText(false);
        break;
    }
  }

}
