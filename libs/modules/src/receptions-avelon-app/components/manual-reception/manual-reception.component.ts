import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from "@ionic/angular";
import { FilterItemsListComponent } from "../filter-items-list/filter-items-list.component";
import {
  environment,
  IntermediaryService,
  ReceptionAvelonModel,
  ReceptionsAvelonService
} from "@suite/services";
import { ReceptionAvelonProvider } from "../../../../../services/src/providers/reception-avelon/reception-avelon.provider";
import { LoadingMessageComponent } from "../../../components/loading-message/loading-message.component";
import { ToolbarProvider } from "../../../../../services/src/providers/toolbar/toolbar.provider";
import { PrinterService } from "../../../../../services/src/lib/printer/printer.service";
import { ModalModelImagesComponent } from "../modal-model-images/modal-model-images.component";
import { PositionsToast } from "../../../../../services/src/models/positionsToast.type";
import {ActivatedRoute, Router} from "@angular/router";
import { LocalStorageProvider } from "../../../../../services/src/providers/local-storage/local-storage.provider";
import {ScreenResult} from "../../../receptions-avelon/enums/screen_result.enum";
import {ModalDestinyReceptionComponent} from "../../modals/modal-model-images/destiny-reception.component";

@Component({
  selector: 'suite-manual-reception',
  templateUrl: './manual-reception.component.html',
  styleUrls: ['./manual-reception.component.scss']
})
export class ManualReceptionComponent implements OnInit, OnDestroy {

  @ViewChild(LoadingMessageComponent) loadingMessageComponent: LoadingMessageComponent;

  public brandSelected: ReceptionAvelonModel.Data = null;
  public modelSelected: ReceptionAvelonModel.Data = null;
  public modelIdSelected: number = null;
  public colorSelected: ReceptionAvelonModel.Data = null;
  public eanCode: string = null;

  expeditionLines: {
    id: number,
    state: number,
    brandId: number,
    modelId: number,
    colorId: number
  }[];
  public listBrands: any[] = [];
  public listModels: any[] = [];
  public listColors: any[] = [];
  public listSizes: ReceptionAvelonModel.LoadSizesList[] = [];

  public resultsList: any[] = [];

  lastPrint;
  private isReceptionWithoutOrder: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private receptionsAvelonService: ReceptionsAvelonService,
    private printerService: PrinterService,
    private intermediaryService: IntermediaryService,
    private receptionAvelonProvider: ReceptionAvelonProvider,
    private toolbarProvider: ToolbarProvider,
    private router: Router,
    private localStorageProvider: LocalStorageProvider
  ) { }

  async ngOnInit() {
    if (this.activatedRoute.snapshot && this.activatedRoute.snapshot.routeConfig && this.activatedRoute.snapshot.routeConfig.path) {
      this.isReceptionWithoutOrder = /^free\//.test(this.activatedRoute.snapshot.routeConfig.path);
    }
    this.loadReceptions();
    this.eanCode = this.activatedRoute.snapshot.paramMap.get("ean");
    this.toolbarProvider.showBackArrow.next(true);
    this.toolbarProvider.currentPage.next('Recepción manual');
    this.toolbarProvider.optionsActions.next([
      {
        label: 'recargar',
        icon: 'refresh',
        action: () => this.resetData()
      }
    ]);
    if (!this.eanCode) {
      try {
        const lastPrint = await this.localStorageProvider.get('lastPrint');
        if(lastPrint){
          this.lastPrint = JSON.parse(String(lastPrint));
          this.brandSelected = this.lastPrint.brand;
          this.modelSelected = this.lastPrint.model;
          this.modelIdSelected = this.modelSelected.id;
          this.colorSelected = this.lastPrint.color;
          this.listSizes = this.lastPrint.sizes;
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  ngOnDestroy() {
    this.toolbarProvider.showBackArrow.next(false);
    this.toolbarProvider.optionsActions.next([]);
  }

  resetSizes() {
    for (let size of this.listSizes) {
      size.quantity = 0;
    }
  }

  private resetData(dataToConcat = null) {
    this.brandSelected = null;
    this.modelSelected = null;
    this.modelIdSelected = null;
    this.colorSelected = null;
    this.listBrands = [];
    this.listModels = [];
    this.listColors = [];
    this.listSizes = [];
    this.resultsList = [];
    this.loadReceptions(dataToConcat);
  }

  private loadReceptions(dataToConcat = null) {
    this.receptionsAvelonService
      .getReceptions(this.receptionAvelonProvider.expeditionData.providerId)
      .subscribe((res) => {
        this.expeditionLines = res.lines;
        this.listBrands = res.brands;
        this.listModels = res.models;
        this.listColors = res.colors;
        if (dataToConcat) {
          for (let brand of dataToConcat.brands) {
            if (!this.listBrands.find(b => b.id == brand.id)) {
              this.listBrands.push(brand);
            }
          }
          for (let color of dataToConcat.colors) {
            const colorInList = this.listColors.find(c => c.id == color.id);
            if (!!colorInList) {
              for (let model of color.belongsModels) {
                if (!colorInList.belongsModels.find(m => m == model)) {
                  colorInList.belongsModels.push(model);
                }
              }
            } else {
              this.listColors.push(color);
            }
          }
          for (let model of dataToConcat.models) {
            const modelInList = this.listModels.find(m => m.name == model.name);
            if (!!modelInList) {
              for (let modelId of model.available_ids) {
                if (!modelInList.available_ids.find(i => i == modelId)) {
                  modelInList.available_ids.push(modelId);
                }
              }
              for (let photo in model.photos_models) {
                if (!modelInList.photos_models) {
                  modelInList.photos_models = {};
                }
                if (!modelInList.photos_models[photo]) {
                  modelInList.photos_models[photo] = model.photos_models[photo];
                }
              }
            } else {
              this.listModels.push(model);
            }
          }
        }
      });
  }

  public async listItems(itemToList: number) {
    let listItemsForFilter = [];
    let filterType = '';

    switch (itemToList) {
      case 1:
        filterType = 'Marcas';
        listItemsForFilter = this.listBrands;
        break;
      case 2:
        filterType = 'Modelos';
        listItemsForFilter = this.listModels;
        break;
      case 3:
        filterType = 'Colores';
        listItemsForFilter = this.listColors;
        break;
    }

    const modal = await this.modalController.create({
      component: FilterItemsListComponent,
      componentProps: {
        filterListType: filterType,
        listItems: listItemsForFilter
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        if (data.data.filterListType == 'Marcas') {
          this.brandSelected = data.data.itemSelected;
          this.getModelAndColorColors(this.brandSelected.id);
        } else if (data.data.filterListType == 'Modelos') {
          this.modelSelected = data.data.itemSelected;
          this.getColorColors(this.modelSelected.id);
        } else if (data.data.filterListType == 'Colores') {
          this.colorSelected = data.data.itemSelected;
        }
        this.updateFilterLists(data.data.itemSelected, data.data.filterListType);
      }
    });

    modal.present();
  }

  getModelAndColorColors(brandId: number) {
    let greenModels: number[] = [];
    let orangeModels: number[] = [];
    let greenColors: number[] = [];
    let orangeColors: number[] = [];
    for (let line of this.expeditionLines) {
      if (!brandId || line.brandId == brandId) {
        if (line.state == 2) {
          if (!greenModels.includes(line.modelId)) {
            greenModels.push(line.modelId);
          }
          if (!greenColors.includes(line.colorId)) {
            greenColors.push(line.colorId);
          }
        } else {
          if (!orangeModels.includes(line.modelId)) {
            orangeModels.push(line.modelId);
          }
          if (!orangeColors.includes(line.colorId)) {
            orangeColors.push(line.colorId);
          }
        }
      }
    }
    orangeModels = orangeModels.filter(model => { return !greenModels.includes(model) });
    orangeColors = orangeColors.filter(color => { return !greenColors.includes(color) });
    for (let model of this.listModels) {
      if (greenModels.includes(model.id)) {
        model.color = 'green';
      } else {
        if (orangeModels.includes(model.id)) {
          model.color = 'orange';
        } else {
          model.color = 'red';
        }
      }
    }
    for (let color of this.listColors) {
      if (greenColors.includes(color.id)) {
        color.color = 'green';
      } else {
        if (orangeColors.includes(color.id)) {
          color.color = 'orange';
        } else {
          color.color = 'red';
        }
      }
    }
  }

  getColorColors(modelId: number) {
    let greenColors: number[] = [];
    let orangeColors: number[] = [];
    for (let line of this.expeditionLines) {
      if (!modelId || line.modelId == modelId) {
        if (line.state == 2 && !greenColors.includes(line.colorId)) {
          greenColors.push(line.colorId);
        } else {
          if (line.state != 2 && !orangeColors.includes(line.colorId)) {
            orangeColors.push(line.colorId);
          }
        }
      }
    }
    orangeColors = orangeColors.filter(color => { return !greenColors.includes(color) });
    for (let color of this.listColors) {
      if (greenColors.includes(color.id)) {
        color.color = 'green';
      } else {
        if (orangeColors.includes(color.id)) {
          color.color = 'orange';
        } else {
          color.color = 'red';
        }
      }
    }
  }

  private updateFilterLists(filterUsed, typeFilter: string) {
    let listModels = [];
    let listBrands = [];
    let listSizes = [];
    let listColors = [];

    if (filterUsed.belongsModels) {
      filterUsed.belongsModels.forEach(modelId => {
        const modelsFilter = this.listModels.filter(model => !!model.available_ids.find(id => id == modelId));
        modelsFilter.forEach(m => {
          const modelFind = listModels.find(elem => elem.id == m.id);
          if (modelFind === undefined) {
            listModels.push(m)
          }
        });

        /***************************brands******************************/
        const brandsFilter = this.listBrands.filter(elem => {
          if (elem.belongsModels.find(elem => elem === modelId)) {
            return elem
          }
        });
        brandsFilter.forEach(elem => {
          if (listBrands.find(data => data.id === elem.id) === undefined) {
            listBrands.push(elem)
          }
        });

        /*****************************color****************************/
        const colorFilter = this.listColors.filter(elem => {
          if (elem.belongsModels.find(elem => elem === modelId)) {
            return elem
          }
        });
        colorFilter.forEach(elem => {
          if (listColors.find(data => data.id === elem.id) === undefined) {
            listColors.push(elem)
          }
        })
      })
    } else {
      const modelsFilter = this.listModels.filter(model => model.id === filterUsed.id);
      modelsFilter.forEach(m => {
        const modelFind = listModels.find(elem => elem.id == m.id);
        if (modelFind === undefined) {
          listModels.push(m)
        }
      });

      /***************************brands******************************/
      const brandsFilter = this.listBrands.filter(elem => !!elem.belongsModels.find(model => !!filterUsed.available_ids.find(id => id == model)));
      brandsFilter.forEach(elem => {
        if (listBrands.find(data => data.id === elem.id) === undefined) {
          listBrands.push(elem)
        }
      });

      /*****************************color****************************/
      const colorFilter = this.listColors.filter(elem => !!elem.belongsModels.find(model => !!filterUsed.available_ids.find(id => id == model)));
      colorFilter.forEach(elem => {
        if (listColors.find(data => data.id === elem.id) === undefined) {
          listColors.push(elem)
        }
      })
    }

    if (listModels.length > 0) {
      this.listModels = listModels;
      if (!this.modelSelected && this.listModels.length == 1) {
        this.modelSelected = this.listModels[0];
        this.modelIdSelected = this.modelSelected.id;
      }

      if (this.colorSelected && this.modelSelected) {
        this.modelIdSelected = this.modelSelected.available_ids.find(id => !!this.colorSelected.belongsModels.find(model => model == id));
      }
    }
    if (listBrands.length > 0) {
      this.listBrands = listBrands;
      if (!this.brandSelected && this.listBrands.length == 1) {
        this.brandSelected = this.listBrands[0];
      }
    }
    if (listColors.length > 0) {
      this.listColors = listColors;
      if (!this.colorSelected && this.listColors.length == 1) {
        this.colorSelected = this.listColors[0];
        this.modelIdSelected = this.modelSelected.available_ids.find(id => !!this.colorSelected.belongsModels.find(model => model == id));
      }
    }

    if (this.modelSelected && this.colorSelected) {
      this.loadSizes();
    }
  }

  public async showImages(ev) {
    const photoForModel = this.getPhotoUrl(this.modelIdSelected);
    if (photoForModel) {
      const popover = await this.popoverController.create({
        component: ModalModelImagesComponent,
        event: ev,
        cssClass: 'popover-images',
        mode: 'ios',
        componentProps: {
          image: photoForModel
        }
      });

      return await popover.present();
    }
  }

  public printCodes() {
    if (this.eanCode) {
      this.checksEanAndPrint(this.eanCode);
    } else {
      this.checksNotifyReceptionAndPrint();
    }
  }

  public getPhotoUrl(modelId): string | boolean {
    if (modelId && this.modelSelected.photos_models && this.modelSelected.photos_models[modelId]) {
      return environment.urlBase + this.modelSelected.photos_models[modelId];
    }

    return false;
  }

  private loadSizes() {
    this.receptionsAvelonService
      .postLoadSizesList({ modelId: this.modelIdSelected, colorId: this.colorSelected.id })
      .subscribe((res: ReceptionAvelonModel.ResponseLoadSizesList) => {
        if (res.code == 200) {
          this.listSizes = res.data;
        } else {
          this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar las tallas correspondientes.', PositionsToast.BOTTOM);
        }
      }, (error) => {
        this.intermediaryService.presentToastError('Ha ocurrido un error al intentar cargar las tallas correspondientes.', PositionsToast.BOTTOM);
      });
  }

  public removeEanCode() {
    this.eanCode = null;
  }

  private checksEanAndPrint(eanCode: string) {
    if (this.checkOnlyOneSizeAndOneQuantity()) {
      this.checksNotifyReceptionAndPrint(eanCode);
    }
  }

  private checksNotifyReceptionAndPrint(eanToAssociate: string = null) {
    const sizesToPrint = this.listSizes.filter(s => {
      return s.quantity > 0;
    });

    if (sizesToPrint.length > 0) {
      this.loadingMessageComponent.show(true, 'Imprimiendo códigos');

      const deliveryNote = this.receptionAvelonProvider.deliveryNote;
      const sizesMapped = sizesToPrint.map(s => {
        const sizeMapped: any = {
          providerId: this.receptionAvelonProvider.expeditionData.providerId,
          expedition: this.receptionAvelonProvider.expeditionData.reference,
          brandId: this.brandSelected.id,
          colorId: this.colorSelected.id,
          sizeId: s.id,
          modelId: this.modelIdSelected,
          quantity: s.quantity
        };
        if (eanToAssociate) {
          sizeMapped.ean = eanToAssociate;
        }
        return sizeMapped;
      });

      const paramsRequest = [];
      for (let size of sizesMapped) {
        for (let q = 0; q < size.quantity; q++) {
          paramsRequest.push(size);
        }
      }

      let params: ReceptionAvelonModel.ParamsToPrint = {
        to_print: paramsRequest
      };
      if (deliveryNote) {
        params.delivery_note = deliveryNote;
      }

      const subscribeResponseOk = async (res) => {
        this.loadingMessageComponent.show(false);
        const referencesToPrint = res.resultToPrint.map(r => r.reference);
        if (referencesToPrint && referencesToPrint.length > 0) {
          this.printerService.printTagBarcode(referencesToPrint)
            .subscribe(async (resPrint) => {
              console.log('Print reference of reception successful');
              if (typeof resPrint == 'boolean') {
                console.log(resPrint);
              } else {
                resPrint.subscribe((resPrintTwo) => {
                  console.log('Print reference of reception successful two', resPrintTwo);
                })
              }
              let lastPrint = {
                brand: this.brandSelected,
                model: this.modelSelected,
                color: this.colorSelected,
                sizes: this.listSizes
              };
              await this.localStorageProvider.set('lastPrint', JSON.stringify(lastPrint));
            }, (error) => {
              console.error('Some error success to print reference of reception', error);
            });

          const someProductToSorter = !!res.resultToPrint.find(r => r.type == ScreenResult.SORTER_VENTILATION);
          let typeDestinyReception = someProductToSorter ? ScreenResult.SORTER_VENTILATION : ScreenResult.WAREHOUSE_LOCATION;
          const modalDestiny = await this.modalController.create({
            component: ModalDestinyReceptionComponent,
            componentProps: { typeDestinyReception: typeDestinyReception }
          });
          modalDestiny.onDidDismiss().then(_ => {
            const routeSections = ['receptions-avelon', 'app'];
            if (this.isReceptionWithoutOrder) {
              routeSections.push('free');
            }

            this.router.navigate(routeSections)
          });
          modalDestiny.present();
        }
        if (res.productsWithError && res.productsWithError.length > 0) {
          let errorMessage = `No se han podido generar e imprimir alguna de las etiquetas necesarias (${res.productsWithError.length}). <br/>Se detalla la incidencia a continuación: <ul>`;
          for (let error of res.productsWithError) {
            errorMessage += `<li>${error.reason}</li>`
          }
          errorMessage += '</ul>';
          this.intermediaryService.presentWarning(errorMessage, null);
          this.intermediaryService.presentToastError('Ha ocurrido un error inesperado al intentar imprimir algunas de las etiquetas necesarias.', PositionsToast.BOTTOM);
        }
      };
      const subscribeResponseError = (error) => {
        this.loadingMessageComponent.show(false);
        this.intermediaryService.presentToastError('Ha ocurrido un error al intentar imprimir las etiquetas necesarias.', PositionsToast.BOTTOM);
      };

      if (this.isReceptionWithoutOrder) {
        this.receptionsAvelonService.makeReceptionFree(params).subscribe(subscribeResponseOk, subscribeResponseError);
      } else {
        this.receptionsAvelonService.printReceptionLabel(params).subscribe(subscribeResponseOk, subscribeResponseError);
      }
    } else {
      this.intermediaryService.presentWarning('Indique qué talla(s) desea imprimir y qué cantidad de etiquetas quiere imprimir por cada talla.', null);
    }
  }

  // check that user only has selected one size and one unity for that size to associate to EAN code
  private checkOnlyOneSizeAndOneQuantity(): boolean {
    const sizesToPrint = this.listSizes.filter(s => {
      return s.quantity > 0;
    });
    if (!sizesToPrint || sizesToPrint.length < 1) {
      this.intermediaryService.presentWarning('Seleccione 1 Ud. de una talla para asociar al EAN escaneado.', null);
      return false;
    } else if (sizesToPrint.length > 1) {
      this.intermediaryService.presentWarning('Seleccione solo una talla para asociar al EAN escaneado. Asegúrese de que solo ha indicado 1 Ud. de la talla que desea asociar al código.', null);
      return false;
    } else if (sizesToPrint[0].quantity > 1) {
      this.intermediaryService.presentWarning('Solo puede asociar a este EAN 1 Ud. de la talla indicada.', null);
      return false;
    }

    return true;
  }
}
