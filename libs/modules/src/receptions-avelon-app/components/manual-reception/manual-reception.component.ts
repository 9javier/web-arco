import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FilterItemsListComponent} from "../filter-items-list/filter-items-list.component";
import {ReceptionAvelonModel, ReceptionsAvelonService} from "@suite/services";
import {ReceptionAvelonProvider} from "../../../../../services/src/providers/reception-avelon/reception-avelon.provider";
import {LoadingMessageComponent} from "../../../components/loading-message/loading-message.component";
import {ToolbarProvider} from "../../../../../services/src/providers/toolbar/toolbar.provider";
import {PrinterService} from "../../../../../services/src/lib/printer/printer.service";

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
  public sizeSelected: ReceptionAvelonModel.Data = null;

  private listBrands: any[] = [];
  private listModels: any[] = [];
  private listColors: any[] = [];
  private listSizes: any[] = [];

  public resultsList: any[] = [];

  constructor(
    private modalController: ModalController,
    private receptionsAvelonService: ReceptionsAvelonService,
    private printerService: PrinterService,
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
    ])
  }

  ngOnDestroy() {
    this.toolbarProvider.optionsActions.next([]);
  }

  private resetData() {
    this.brandSelected = null;
    this.modelSelected = null;
    this.modelIdSelected = null;
    this.colorSelected = null;
    this.sizeSelected = null;
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
        console.log('Test::data.data.itemSelected', data.data.itemSelected);
        if (data.data.filterListType == 'Marcas') {
          this.brandSelected = data.data.itemSelected;
        } else if (data.data.filterListType == 'Modelos') {
          this.modelSelected = data.data.itemSelected;
        } else if (data.data.filterListType == 'Colores') {
          this.colorSelected = data.data.itemSelected;
        } else if (data.data.filterListType == 'Tallas') {
          this.sizeSelected = data.data.itemSelected;
        }
        this.updateFilterLists(data.data.itemSelected, data.data.filterListType);
      }
    });

    modal.present();
  }

  public checkProduct() {
    this.loadingMessageComponent.show(true);

    const params: any = {
      providerId: this.receptionAvelonProvider.expeditionData.providerId,
      expedition: this.receptionAvelonProvider.expeditionData.reference,
      brandId: this.brandSelected.id,
      colorId: this.colorSelected.id,
      sizeId: this.sizeSelected.id,
      modelId: this.modelIdSelected
    };
    this.receptionsAvelonService
      .printReceptionLabel(params)
      .subscribe((res) => {
        this.loadingMessageComponent.show(false);
        this.resultsList = [{
          model: this.modelSelected.name,
          brand: this.brandSelected.name,
          color: this.colorSelected.name,
          size: this.sizeSelected.name,
          reference: res.reference
        }];
      }, (error) => {
        this.loadingMessageComponent.show(false);
      });
  }

  public printProductReceived(item) {
    this.printerService.printTagBarcode([item.reference])
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

        if (typeFilter == 'Colores') {
          this.modelIdSelected = this.modelSelected.available_ids.find(id => !!this.colorSelected.belongsModels.find(model => model == id));
        }
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
      }
    }
    if (listSizes.length > 0) {
      this.listSizes = listSizes;
      if (!this.sizeSelected && this.listSizes.length == 1) {
        this.sizeSelected = this.listSizes[0];
      }
    }
  }
}
