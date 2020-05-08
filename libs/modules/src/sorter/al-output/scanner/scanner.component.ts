import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment as al_environment } from "../../../../../../apps/al/src/environments/environment";
import { SorterProvider } from "../../../../../services/src/providers/sorter/sorter.provider";
import {ItemReferencesProvider} from "../../../../../services/src/providers/item-references/item-references.provider";
import { GlobalVariableService, GlobalVariableModel, IntermediaryService } from "@suite/services";
import { OutputSorterModel } from "../../../../../services/src/models/endpoints/OutputSorter";
import { ProductSorterModel } from "../../../../../services/src/models/endpoints/ProductSorter";
import { AlertController, ModalController } from "@ionic/angular";
import { ExecutionSorterModel } from "../../../../../services/src/models/endpoints/ExecutionSorter";
import { HttpRequestModel } from "../../../../../services/src/models/endpoints/HttpRequest";
import { SorterExecutionService } from "../../../../../services/src/lib/endpoint/sorter-execution/sorter-execution.service";
import { Location } from "@angular/common";
import { SorterOutputService } from "../../../../../services/src/lib/endpoint/sorter-output/sorter-output.service";
import { SorterOutputModel } from "../../../../../services/src/models/endpoints/SorterOutput";
import { AudioProvider } from "../../../../../services/src/providers/audio-provider/audio-provider.provider";
import { Router, ActivatedRoute } from '@angular/router';
import { WaySorterModel } from 'libs/services/src/models/endpoints/WaySorter';
import {KeyboardService} from "../../../../../services/src/lib/keyboard/keyboard.service";
import {Events} from "@ionic/angular";
import { CarrierService } from '../../../../../services/src/lib/endpoint/carrier/carrier.service';
import { ListasProductosComponent } from 'libs/modules/src/picking-manual/lista/listas-productos/listas-productos.component';
import { ListProductsCarrierComponent } from '../../../components/list-products-carrier/list-products-carrier.component';

@Component({
  selector: 'sorter-output-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerOutputSorterComponent implements OnInit, OnDestroy {

  messageGuide: string = 'ESCANEAR 1º ARTÍCULO';
  inputValue: string = null;
  lastCodeScanned: string = 'start';
  processStarted: boolean = false;
  isFirstProductScanned: boolean = false;
  wrongCodeScanned: boolean = false;
  lastProductScannedChecking: ProductSorterModel.ProductSorter = null;
  packingIsFull: boolean = false;
  hideLeftButtonFooter: boolean = true;
  hideRightButtonFooter: boolean = true;
  lastProductScanned: boolean = false;
  outputWithIncidencesClear: boolean = false;
  isWaitingSorterFeedback = false;

  ULTIMA_JAULA:string;
  lastWarehouse = null;
  lastWarehouseReference = null;
  ultimaReferenza:string;
  alerta:boolean;

  listVariables: Array<GlobalVariableModel.GlobalVariable> = new Array<GlobalVariableModel.GlobalVariable>();
  private listTypesFromDb: Array<{ id: number, name: string, workwave: boolean, type: string, tooltip: string }> = [];
  private listVariablesFromDb: Array<GlobalVariableModel.GlobalVariable> = new Array<GlobalVariableModel.GlobalVariable>();
  private countLoadOfVariables: number = 0;
  private readonly SECONDS_COUNTDOWN_TO_CONFIRM_EMPTY_WAY: number = 3;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  leftButtonText: string = 'JAULA LLENA.';
  rightButtonText: string = 'CALLE VACÍA';
  leftButtonDanger: boolean = true;

  infoSorterOperation: OutputSorterModel.OutputSorter = null;
  public waySelectedToEmptying: WaySorterModel.WaySorter = null;

  private checkByWrongCode: boolean = true;

  private launchIncidenceBeep: boolean = false;
  private intervalIncidenceBeep = null;

  private wayIsEmpty: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private activate: ActivatedRoute,
    private alertController: AlertController,
    private intermediaryService: IntermediaryService,
    private sorterExecutionService: SorterExecutionService,
    public sorterProvider: SorterProvider,
    private sorterOutputService: SorterOutputService,
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private carrier: CarrierService,
    public  events: Events,
    private modalCtrl: ModalController,
    private globalVariableService: GlobalVariableService,
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input').focus();
    }, 800);
    this.events.subscribe('load_of_variables', () => {
      this.countLoadOfVariables++;
      if (this.countLoadOfVariables === 2) {
        this.generateVariablesList();
        this.countLoadOfVariables = 0;
      }
    });
  }

  ngOnInit() {
    this.infoSorterOperation = this.sorterProvider.infoSorterOutputOperation;
    this.getTypes();
    this.getGlobalVariables();
  }

  ngOnDestroy() {
    this.checkByWrongCode = false;
    this.launchIncidenceBeep = false;
    this.wayIsEmpty = true;
    this.events.publish('sorter:refresh', this.wayIsEmpty);
  }

  focusToInput() {
    setTimeout(() => {
      if (!this.isWaitingSorterFeedback && document.getElementById('input')) {
        document.getElementById('input').focus()
      }
    }, 500);
  }


  private async modalList( jaula:string){
    let modal = await this.modalCtrl.create({

      component: ListProductsCarrierComponent,
      componentProps: {
        carrierReference:jaula,
        process: 'sorter-emptying'
      }

    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data === undefined && data.role === undefined){
        this.focusToInput();
        return;
      }

      if(data.data && data.role === undefined){
        if(this.itemReferencesProvider.checkCodeValue(data.data) === this.itemReferencesProvider.codeValue.PACKING){
          // console.log('passo di qui ',this.lastCodeScanned);

          this.focusToInput();
          this.inputValue = data.data;
          this.ultimaReferenza = data.data;
          // this.processInitiated = false;
          this.keyUpInput(KeyboardEvent['KeyCode'] = 13,true);
          return;
        }else if(data.role === 'navigate'){
          this.focusToInput();
        }
      }

    })
    modal.present();
  }

  async keyUpInput(event?,test = false) {
    let dataWrote = (this.inputValue || "").trim();

    this.ultimaReferenza = dataWrote;

    if (event.keyCode === 13 || test && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputValue = null;
        this.focusToInput();
        return;
      }
      this.lastCodeScanned = dataWrote;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.inputValue = null;

      if (this.itemReferencesProvider.checkCodeValue(dataWrote) === this.itemReferencesProvider.codeValue.PACKING) {
        if (this.processStarted && this.infoSorterOperation.packingReference) {
          this.audioProvider.playDefaultError();
          await this.intermediaryService.presentToastError('Código de producto erróneo.');
          this.focusToInput();
        } else {

          this.carrier.getSingle(dataWrote).subscribe(data => {
            if(data.packingInventorys.length > 0 && !test){
              this.modalList(dataWrote)
            }else{
              this.assignPackingToProcess(dataWrote);
            }
          })

        }
      } else if (this.itemReferencesProvider.checkCodeValue(dataWrote) === this.itemReferencesProvider.codeValue.PRODUCT) {
        if (this.processStarted && this.infoSorterOperation.packingReference) {
          this.outputProductFromSorter(dataWrote);
        } else if (this.packingIsFull) {
          this.audioProvider.playDefaultError();
          await this.intermediaryService.presentToastError('Escanea el nuevo embalaje a utilizar antes de continuar con los productos.');
          this.focusToInput();
        } else {
          this.audioProvider.playDefaultError();
          await this.intermediaryService.presentToastError('Escanea el embalaje a utilizar antes de comenzar con los productos.');
          this.focusToInput();
        }
      } else {
        if (!this.processStarted) {
          this.audioProvider.playDefaultError();
          await this.intermediaryService.presentToastError('Escanea un embalaje para comenzar las operaciones.');
          this.focusToInput();
        }
      }
    }
  }

  generateVariablesList() {
    this.intermediaryService.dismissLoading();
    if (this.listVariablesFromDb.length !== this.listTypesFromDb.length) {
      this.listVariables = this.listVariablesFromDb;
      for (let iType in this.listTypesFromDb) {
        let type = this.listTypesFromDb[iType];
        let isTypeCreated: boolean = false;
        for (let iVariable in this.listVariablesFromDb) {
          let variable = this.listVariablesFromDb[iVariable];
          if (variable.type === type.id) {
            isTypeCreated = true;
            break;
          }
        }
        if (!isTypeCreated) {
          this.listVariables.push({ type: type.id, value: null, tooltip: null });
        }
      }
    } else {
      this.listVariables = this.listVariablesFromDb;
    }
    this.listVariables.sort((a, b) => {
      return a.type < b.type ? -1 : 1;
    })
  }

  getGlobalVariables() {
    this.globalVariableService
      .getAll()
      .subscribe((globalVariables) => {
        console.log(globalVariables);
        this.listVariablesFromDb = globalVariables;
        this.events.publish('load_of_variables');
      });
  }

  getTypes() {
    this.globalVariableService
      .getTypes()
      .subscribe((types) => {
        this.listTypesFromDb = types;
        this.events.publish('load_of_variables');
      });
  }

  async emptyWay() {
    let showModalWithCount = async () => {

      let globalVar = 5;
      let textCountdown = 'Revisa para confirmar que la calle está completamente vacía.<br/>';
      let globalFound = this.listVariables.find( global => {
        return global.type === this.SECONDS_COUNTDOWN_TO_CONFIRM_EMPTY_WAY;

      });
      if(globalFound && globalFound.value){

        globalVar = parseInt(globalFound.value);
      }
      let countdown = globalVar;
      let enableSetWayAsEmpty = false;

      let buttonCancel = {
        text: 'Cancelar',
        handler: () => this.unlockCurrentWay()
      };

      let buttonOk = {
        text: 'Confirmar',
        handler: () => this.jaulaLlena()
        // handler: () => this.setWayAsEmpty()

      };

      let alertEmptyPacking = await this.alertController.create({
        header: '¿Está vacía?',
        message: textCountdown + '<h2>' + countdown + 's</h2>',
        backdropDismiss: false,
        buttons: [
          buttonCancel
        ]
      });

      await alertEmptyPacking.present();

      let intervalChangeCountdown = setInterval(() => {
        countdown--;
        if (countdown === -1) {
          clearInterval(intervalChangeCountdown);
          alertEmptyPacking.message = textCountdown + '<b>Ya puedes pulsar confirmar.</b>';
          alertEmptyPacking.buttons = [buttonCancel, buttonOk];
          enableSetWayAsEmpty = true;
        } else {
          alertEmptyPacking.message = textCountdown + '<h2>' + countdown + 's</h2>';
        }
      }, 1000);
    };

    await this.intermediaryService.presentLoading('Bloqueando procesos en calle...');

    this.sorterOutputService
      .postBlockSorterWay({
        block: true,
        wayId: this.infoSorterOperation.wayId.toString()
      })
      .then(async (res: SorterOutputModel.ResponseBlockSorterWay) => {
        if (res.code === 200) {
          await this.intermediaryService.dismissLoading();
          showModalWithCount();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar bloquear los procesos en la calle actual.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar bloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar bloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  async packingFull() {
    let callback = () => {
      if (this.wrongCodeScanned) {
        this.setPackingAsFull();
      } else {
        this.packingIsFull = true;
        this.hideLeftButtonFooter = true;
        this.hideRightButtonFooter = false;
        this.messageGuide = 'Escanea el primer artículo de la calle.';
      }
    };
    await this.intermediaryService.presentConfirm(`¿Quiere marcar el embalaje ${this.infoSorterOperation.packingReference} como lleno y continuar trabajando con otro embalaje?`, callback);
  }

  finishOutputWithIncidences() {
    this.wrongCodeScanned = false;

    this.hideLeftButtonFooter = false;
    this.hideRightButtonFooter = false;

    this.isFirstProductScanned = false;
    this.messageGuide = 'ESCANEAR 1º ARTÍCULO';
    this.focusToInput();

    this.checkByWrongCode = true;
    this.checkWayWithIncidence();

    this.outputWithIncidencesClear = false;
    this.launchIncidenceBeep = false;
  }

  /**
   * @description Alert cuando terminan las calles por warehoise
   */
  private async nuevaAlert(){
    const referenceWarehouseEmptying = this.infoSorterOperation.destinyWarehouse.reference;
    this.alerta = false;

    let alert = await this.alertController.create({
      message: `No hay más calles a vaciar para la tienda ${referenceWarehouseEmptying}.<br/>Deberá escanear un nuevo embalaje para continuar el vaciado de otras calles con otro destino.`,
      buttons: ['Continuar']
    });

    await alert.present();
  }

  private async assignPackingToProcess(packingReference: string) {
    this.ULTIMA_JAULA = packingReference;
    this.lastWarehouse = null;
    this.lastWarehouseReference = null;

    await this.intermediaryService.presentLoading('Asignando embalaje al proceso...');

    this.sorterOutputService
      .postAssignPackingToWay({
        packingReference,
        wayId: this.infoSorterOperation.wayId.toString()
      })
      .then(async (res: SorterOutputModel.ResponseAssignPackingToWay) => {

        if (res.code === 200) {
          this.ULTIMA_JAULA = res && res.data && res.data.packing ? res.data.packing.reference : null;
          if(res.data && res.data.way && res.data.way['warehouse']){
            this.lastWarehouse = res.data.way['warehouse'];
            this.lastWarehouseReference = this.lastWarehouse && this.lastWarehouse['name'] ? this.lastWarehouse['name'] : null;
          }

          // If output process is not started yet (first packing scanned) start here to check if current way have incidences
          if (!this.processStarted) {
            this.checkWayWithIncidence();
          }
          this.messageGuide = 'ESCANEAR 1º ARTÍCULO';
          this.processStarted = true;
          this.packingIsFull = false;
          this.lastProductScanned = false;
          this.infoSorterOperation.packingReference = packingReference;
          this.isFirstProductScanned = false;
          await this.intermediaryService.dismissLoading();
          this.audioProvider.playDefaultOk();
          await this.intermediaryService.presentToastSuccess(`Iniciando proceso con el embalaje ${packingReference}.`);
          this.focusToInput();
        } else {
          this.ULTIMA_JAULA = null;
          if(res.code === 405 && this.alerta) {
            this.nuevaAlert()
          }
          this.audioProvider.playDefaultError();
          let errorMessage = 'Ha ocurrido un error al intentar asignar el embalaje escaneado al proceso.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        this.ULTIMA_JAULA = null;
        this.audioProvider.playDefaultError();
        let errorMessage = 'Ha ocurrido un error al intentar asignar el embalaje escaneado al proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        this.ULTIMA_JAULA = null;

        this.audioProvider.playDefaultError();
        let errorMessage = 'Ha ocurrido un error al intentar asignar el embalaje escaneado al proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private async outputProductFromSorter(productReference: string) {
    await this.intermediaryService.presentLoading('Comprobando producto escaneado...');

    this.sorterOutputService
      .postScanProductPutInPacking({
        productReference,
        packingReference: this.infoSorterOperation.packingReference,
        wayId: this.infoSorterOperation.wayId,
        fullPacking: this.packingIsFull,
        incidenceProcess: this.wrongCodeScanned
      })
      .then(async (res: SorterOutputModel.ResponseScanProductPutInPacking) => {
        if (res.code === 201) {
          await this.intermediaryService.dismissLoading();

          if (res.data.processStopped && !this.wrongCodeScanned) {
            this.audioProvider.playDefaultOk();
            await this.intermediaryService.presentToastSuccess('Proceso de salida finalizado.', 2000);
            this.stopExecutionOutput();
          } else {
            if (this.wrongCodeScanned) {
              let resData = res.data;
              this.messageGuide = 'ESCANEAR ARTÍCULO';
              if (!resData.productInSorter) {
                this.lastProductScannedChecking = null;
                this.audioProvider.playDefaultError();
                await this.intermediaryService.presentToastError(`¡El producto ${productReference} no debería de estar en el sorter!`);
                this.focusToInput();
              } else {
                this.lastProductScannedChecking = {
                  reference: resData.product.reference,
                  destinyWarehouse: {
                    id: resData.warehouse.id,
                    name: resData.warehouse.name,
                    reference: resData.warehouse.reference
                  },
                  model: {
                    reference: resData.product.model.reference
                  },
                  size: {
                    name: resData.product.size.name
                  }
                };
                this.hideLeftButtonFooter = false;
                this.hideRightButtonFooter = false;
                if (this.lastProductScannedChecking.destinyWarehouse.id !== this.infoSorterOperation.destinyWarehouse.id) {
                  this.audioProvider.playDefaultError();
                  await this.intermediaryService.presentToastError(`¡El producto ${productReference} tiene asignado un destino diferente al de la calle actual!`);
                  if (resData.wayWithIncidences) {
                    this.focusToInput();
                  } else {
                    this.outputWithIncidencesClear = true;
                    this.hideLeftButtonFooter = true;
                  }
                } else {
                  this.audioProvider.playDefaultOk();
                  await this.intermediaryService.presentToastSuccess(`Producto ${productReference} comprobado y válido. Puede añadirlo al embalaje.`, 2000);
                  if (resData.wayWithIncidences) {
                    this.focusToInput();
                  } else {
                    this.outputWithIncidencesClear = true;
                    this.hideLeftButtonFooter = true;
                  }
                }
              }
            } else {
              this.audioProvider.playDefaultOk();
              await this.intermediaryService.presentToastSuccess(`Producto ${productReference} comprobado y válido.`, 2000);
              if (this.packingIsFull) {

                this.lastProductScanned = true;
                this.setPackingAsFull();
              } else {

                this.hideLeftButtonFooter = false;
                this.hideRightButtonFooter = false;

                this.isFirstProductScanned = true;
                this.messageGuide = 'ESCANEAR ARTÍCULO';
                this.focusToInput();
              }
            }
          }
        } else {
          this.audioProvider.playDefaultError();
          let errorMessage = 'Ha ocurrido un error al intentar comprobar el producto escaneado.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        this.audioProvider.playDefaultError();
        let errorMessage = 'Ha ocurrido un error al intentar comprobar el producto escaneado.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        this.audioProvider.playDefaultError();
        let errorMessage = 'Ha ocurrido un error al intentar comprobar el producto escaneado.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private async setPackingAsFull() {

    await this.intermediaryService.presentLoading('Registrado embalaje como lleno...');

    this.sorterOutputService
      .postPackingFull({
        packingReference: this.infoSorterOperation.packingReference,
        wayId: this.infoSorterOperation.wayId.toString()
      })
      .then(async (res: SorterOutputModel.ResponsePackingFull) => {

        if (res.code === 200) {
          this.audioProvider.playDefaultOk();
          if (this.wrongCodeScanned) {
            this.lastProductScannedChecking = null;
          }
          this.hideLeftButtonFooter = true;
          this.hideRightButtonFooter = true;
          this.infoSorterOperation.packingReference = null;
          this.messageGuide = 'Escanea un embalaje nuevo para continuar';
          await this.intermediaryService.presentToastSuccess('Embalaje registrado como lleno en el sistema. Escanea un nuevo embalaje para continuar con el proceso.');
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        } else {
          this.audioProvider.playDefaultError();
          let errorMessage = 'Ha ocurrido un error al intentar registrar el embalaje como lleno.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        this.audioProvider.playDefaultError();
        let errorMessage = 'Ha ocurrido un error al intentar registrar el embalaje como lleno.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        this.audioProvider.playDefaultError();
        let errorMessage = 'Ha ocurrido un error al intentar registrar el embalaje como lleno.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      });
  }

  private async jaulaLlena(){
    this.alerta = false;
    let alert = await this.alertController.create({
      header:`¿El embalaje ${this.infoSorterOperation.packingReference} está lleno? `,
      buttons:[
        {
          text:'SI',
          handler:()=>{
            this.outputWithIncidencesClear = false;
            let productReference = this.ultimaReferenza;
            this.sorterOutputService
            .postPackingFull({
              packingReference: this.infoSorterOperation.packingReference,
              wayId: this.infoSorterOperation.wayId.toString()
            }).then(res=>{
              console.log(res);
              if(res.code === 200){
                this.audioProvider.playDefaultOk();
                this.ULTIMA_JAULA = null;
                this.setWayAsEmpty().then(()=>{
                  this.packingIsFull = false;
                })
              }
            });
        }},
        {
          text:`No`,
          handler:()=>{
            this.alerta = true;
            this.outputWithIncidencesClear = false;
            this.setWayAsEmpty();
          }
        }
      ]
    })
    await alert.present();
  }

  private async setWayAsEmpty() {
    await this.intermediaryService.presentLoading('Comprobando que la calle esté vacía...');
    setTimeout(() => {
      this.sorterOutputService
        .postEmptyWay({
          wayId: this.infoSorterOperation.wayId.toString()
        })
        .then(async (res: SorterOutputModel.ResponseEmptyWay) => {
          console.log(res);

          if (res.code === 200) {
            this.audioProvider.playDefaultOk();
            this.sorterProvider.colorActiveForUser = null;
            await this.intermediaryService.dismissLoading();
            await this.intermediaryService.presentToastSuccess(`Registrada la calle como vacía.`);
            this.stopExecutionOutput();
          } else {
            this.audioProvider.playDefaultError();
            let errorMessage = 'Ha ocurrido un error al intentar marcar como vacía la calle.';
            if (res.errors) {
              errorMessage = res.errors;
            }
            await this.intermediaryService.presentToastError(errorMessage);
            await this.intermediaryService.dismissLoading();
            this.focusToInput();
          }
        }, async (error) => {
          this.audioProvider.playDefaultError();
          let errorMessage = 'Ha ocurrido un error al intentar marcar como vacía la calle.';
          if (error.error && error.error.errors) {
            errorMessage = error.error.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        })
        .catch(async (error) => {
          this.audioProvider.playDefaultError();
          let errorMessage = 'Ha ocurrido un error al intentar marcar como vacía la calle.';
          if (error.error && error.error.errors) {
            errorMessage = error.error.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        });
    }, 2 * 1000);
  }

  private async unlockCurrentWay() {
    await this.intermediaryService.presentLoading('Desblloqueando procesos en calle...');

    this.sorterOutputService
      .postBlockSorterWay({
        wayId: this.infoSorterOperation.wayId.toString(),
        block: false
      })
      .then(async (res: SorterOutputModel.ResponseBlockSorterWay) => {
        if (res.code === 200) {
          await this.intermediaryService.presentToastSuccess('Calle desbloqueada para continuar con su uso.');
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        } else {
          let errorMessage = 'Ha ocurrido un error al intentar desbloquear los procesos en la calle actual.';
          if (res.errors) {
            errorMessage = res.errors;
          }
          await this.intermediaryService.presentToastError(errorMessage);
          await this.intermediaryService.dismissLoading();
          this.focusToInput();
        }
      }, async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar desbloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
      .catch(async (error) => {
        let errorMessage = 'Ha ocurrido un error al intentar desbloquear los procesos en la calle actual.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        await this.intermediaryService.dismissLoading();
        this.focusToInput();
      })
  }

  private checkWayWithIncidence() {
    let someCounter = 0;
    let checkWayWithIncidenceLocal = () => {
      someCounter++;
      let wayId = this.infoSorterOperation.wayId;

      this.sorterOutputService
        .postGetIncidenceWay({
          way: wayId
        })
        .then(async (res: SorterOutputModel.ResponseGetIncidenceWay) => {
          if (res.code === 201 && res.data) {
            this.wrongCodeDetected();
            this.focusToInput();
          } else if (this.checkByWrongCode) {
            setTimeout(() => checkWayWithIncidenceLocal(), 1000);
          }
        }, (error) => {
          console.error('Error::onrejected::sorterOutputService::postGetIncidenceWay', error)
        })
        .catch((error) => {
          console.error('Error::catch::sorterOutputService::postGetIncidenceWay', error)
        });
    };

    checkWayWithIncidenceLocal();
  }

  private async wrongCodeDetected() {
    this.launchIncidenceBeep = true;
    this.launchIncidenceSound();
    this.wrongCodeScanned = true;
    this.leftButtonDanger = false;
    this.checkByWrongCode = false;
  }

  private launchIncidenceSound() {
    if (!this.intervalIncidenceBeep) {
      this.intervalIncidenceBeep = setInterval(() => {
        if (!this.launchIncidenceBeep) {
          clearInterval(this.intervalIncidenceBeep);
          this.intervalIncidenceBeep = null;
        }
        this.audioProvider.play('incidenceBeep');
      }, 3 * 1000);
    }
  }

  private stopExecutionOutput() {
    this.sorterExecutionService
      .postStopExecuteColor()
      .subscribe(async (res: ExecutionSorterModel.StopExecuteColor) => {

        let paramsRequest: ExecutionSorterModel.ParamsExecuteColor = {
          color: this.sorterProvider.colorSelected.id,
          type: 2
        };
        if (paramsRequest) {
          this.sorterExecutionService.postExecuteColor(paramsRequest).subscribe(data => {

            let idWayToWork = null;
            if (this.waySelectedToEmptying) {
              idWayToWork = this.waySelectedToEmptying.id;
            }

            let lastWarehouse: number;
            if (this.sorterProvider.infoSorterOutputOperation) {
              lastWarehouse = this.sorterProvider.infoSorterOutputOperation.destinyWarehouse.id;
            }

            this.sorterOutputService.getNewProcessWay(idWayToWork, lastWarehouse)
              .then(async (res2: SorterOutputModel.ResponseNewProcessWay) => {

                if (res2.code === 201) {
                  this.inputValue = null;
                  this.processStarted = null;
                  this.isFirstProductScanned = false;
                  this.wrongCodeScanned = false;
                  this.packingIsFull = false;

                  let id = this.sorterProvider.id_wareHouse;

                  let newProcessWay = res2.data;
                  this.infoSorterOperation = {
                    destinyWarehouse: {
                      id: newProcessWay.warehouse.id,
                      name: newProcessWay.warehouse.name,
                      reference: newProcessWay.warehouse.reference
                    },
                    wayId: newProcessWay.way.zoneWay.ways.id
                  };

                  if(this.ULTIMA_JAULA || this.ULTIMA_JAULA !== null){
                    this.assignPackingToProcess(this.ULTIMA_JAULA);
                  }
                  this.focusToInput();
                } else {
                  let errorMessage = 'Ha ocurrido un error al intentar obtener la nueva calle donde trabajar.';
                  if (res2.errors) {
                    errorMessage = res2.errors;
                  }
                  await this.intermediaryService.presentToastError(errorMessage);
                  this.location.back();
                }

              }).catch(error => { this.location.back() })
          })
        }

        await this.intermediaryService.dismissLoading();
        this.sorterProvider.colorActiveForUser = null;
        this.checkByWrongCode = true;
      }, async (error: HttpRequestModel.Error) => {
        await this.intermediaryService.dismissLoading();
        let errorMessage = 'Ha ocurrido un error al intentar finalizar el proceso.';
        if (error.error && error.error.errors) {
          errorMessage = error.error.errors;
        }
        await this.intermediaryService.presentToastError(errorMessage);
        this.focusToInput();
      });
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }
}
