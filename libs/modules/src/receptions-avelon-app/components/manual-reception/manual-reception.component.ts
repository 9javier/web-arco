import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, PopoverController} from "@ionic/angular";
import {FilterItemsListComponent} from "../filter-items-list/filter-items-list.component";
import {
  environment,
  IntermediaryService,
  ReceptionAvelonModel,
  ReceptionsAvelonService
} from "@suite/services";
import {ReceptionAvelonProvider} from "../../../../../services/src/providers/reception-avelon/reception-avelon.provider";
import {LoadingMessageComponent} from "../../../components/loading-message/loading-message.component";
import {ToolbarProvider} from "../../../../../services/src/providers/toolbar/toolbar.provider";
import {PrinterService} from "../../../../../services/src/lib/printer/printer.service";
import {ModalModelImagesComponent} from "../modal-model-images/modal-model-images.component";

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

  private listBrands: any[] = [];
  private listModels: any[] = [];
  private listColors: any[] = [];
  private listSizes: any[] = [];

  public resultsList: any[] = [];

  private qtyCodesToPrint: number = 0;

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private receptionsAvelonService: ReceptionsAvelonService,
    private printerService: PrinterService,
    private intermediaryService: IntermediaryService,
    private receptionAvelonProvider: ReceptionAvelonProvider,
    private toolbarProvider: ToolbarProvider
  ) { }

  ngOnInit() {
    this.loadReceptions();
    this.toolbarProvider.currentPage.next('Recepción manual');
    this.toolbarProvider.optionsActions.next([
      {
        label: 'recargar',
        icon: 'refresh',
        action: () => this.resetData()
      }
    ]);
  }

  ngOnDestroy() {
    this.toolbarProvider.optionsActions.next([]);
  }

  private resetData() {
    this.brandSelected = null;
    this.modelSelected = null;
    this.modelIdSelected = null;
    this.colorSelected = null;
    this.listBrands = [];
    this.listModels = [];
    this.listColors = [];
    this.listSizes = [];
    this.resultsList = [];
    this.loadReceptions();
  }

  private loadReceptions() {
    this.receptionsAvelonService
      .getReceptions(this.receptionAvelonProvider.expeditionData.providerId)
      .subscribe((res) => {
        this.listBrands = res.brands;
        this.listModels = res.models;
        this.listColors = res.colors;
        this.listSizes = res.sizes;
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
      case 4:
        filterType = 'Tallas';
        listItemsForFilter = this.listSizes;
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
        } else if (data.data.filterListType == 'Modelos') {
          this.modelSelected = data.data.itemSelected;
        } else if (data.data.filterListType == 'Colores') {
          this.colorSelected = data.data.itemSelected;
        }
        this.updateFilterLists(data.data.itemSelected, data.data.filterListType);
      }
    });

    modal.present();
  }

  public checkProduct(sizeIdToPrint: number) {
    const params: any = {
      providerId: this.receptionAvelonProvider.expeditionData.providerId,
      expedition: this.receptionAvelonProvider.expeditionData.reference,
      brandId: this.brandSelected.id,
      colorId: this.colorSelected.id,
      sizeId: sizeIdToPrint,
      modelId: this.modelIdSelected
    };
    this.receptionsAvelonService
      .printReceptionLabel(params)
      .subscribe((res) => {
        this.qtyCodesToPrint--;
        if (this.qtyCodesToPrint == 0) {
          this.loadingMessageComponent.show(false);
        }
        this.printerService.printTagBarcode([res.reference])
          .subscribe((resPrint) => {
            console.log('Print reference of reception successful');
            if (typeof resPrint == 'boolean') {
              console.log(resPrint);
            } else {
              resPrint.subscribe((resPrintTwo) => {
                console.log('Print reference of reception successful two', resPrintTwo);
              })
            }
          }, (error) => {
            console.error('Some error success to print reference of reception', error);
          });
      }, (error) => {
        this.qtyCodesToPrint--;
        if (this.qtyCodesToPrint == 0) {
          this.loadingMessageComponent.show(false);
        }
      });
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

        /****************************sizes*****************************/
        const sizesFilter = this.listSizes.filter(elem => {
          if (elem.belongsModels.find(elem => elem === modelId)) {
            return elem
          }
        });
        sizesFilter.forEach(elem => {
          if (listSizes.find(data => data.id === elem.id) === undefined) {
            listSizes.push(elem)
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

      /****************************sizes*****************************/
      const sizesFilter = this.listSizes.filter(elem => !!elem.belongsModels.find(model => !!filterUsed.available_ids.find(id => id == model)));
      sizesFilter.forEach(elem => {
        if (listSizes.find(data => data.id === elem.id) === undefined) {
          listSizes.push(elem)
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
        this.modelIdSelected =  this.modelSelected.id;
      }

      if (typeFilter == 'Colores') {
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
    if (listSizes.length > 0) {
      this.listSizes = listSizes;
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
    this.qtyCodesToPrint = 0;
    const sizesToPrint = this.listSizes.filter(s => {
      if (s.quantity > 0) {
        this.qtyCodesToPrint += s.quantity;
        return true;
      } else {
        return false;
      }
    });
    if (sizesToPrint.length > 0) {
      this.loadingMessageComponent.show(true, 'Imprimiendo códigos');
      for (let size of sizesToPrint) {
        for (let i = 0; i < size.quantity; i++) {
          this.checkProduct(size.id);
        }
      }
    } else {
      this.intermediaryService.presentWarning('Indique qué talla(s) desea imprimir y qué cantidad de etiquetas quiere imprimir por cada talla.', null);
    }
  }

  private getPhotoUrl(modelId): string | boolean {
    if (modelId && this.modelSelected.photos_models && this.modelSelected.photos_models[modelId]) {
      return environment.urlBase + this.modelSelected.photos_models[modelId];
    }

    return false;
  }
}
