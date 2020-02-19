import {AlertController, ModalController} from '@ionic/angular';
import {Observable, Subscription} from 'rxjs';
import { Router } from '@angular/router';
import {
  ReceptionsAvelonService,
  ReceptionAvelonModel,
  IntermediaryService,
  ProductsService
} from '@suite/services';
import {Component, OnInit, OnDestroy, ViewChild, AfterContentInit, ChangeDetectorRef, ElementRef, AfterViewInit} from '@angular/core';
import { Type } from './enums/type.enum';
import { VirtualKeyboardService } from '../components/virtual-keyboard/virtual-keyboard.service';
import { Reception } from './classes/reception.class';
import { ListsComponent } from './components/lists/lists.component';
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {InfoModalComponent} from "./info-modal/info-modal.component";

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss']
})
export class ReceptionsAvelonComponent implements OnInit, OnDestroy, AfterContentInit, AfterViewInit{

  @ViewChild(ListsComponent) listsComponent:ListsComponent;
  @ViewChild('provider') providerInput: ElementRef;
  @ViewChild('expedition') expeditionInput: ElementRef;

  response: ReceptionAvelonModel.Reception;
  dato: ReceptionAvelonModel.Data;
  subscriptions: Subscription;
  providers: Array<any>;
  isProviderAvailable: boolean;
  expedition: string;
  provid: string;
  providerId: number;
  interval: any;
  option: any;
  typeScreen: number;
  filter;
  objectType = Type;
  filterData: ReceptionAvelonModel.Reception;
  result: ReceptionAvelonModel.Print = {
    reference: undefined,
    brandId: undefined,
    colorId: undefined,
    sizeId: undefined,
    modelId: undefined,
    providerId: undefined,
    expedition: '',
    ean: ''
  };
  providersAux;
  value;
  getReceptionsNotifiedProviders$: Subscription;
  myControl = new FormControl();
  filteredProviders: Observable<any[]>;
  showCheck: boolean = true;
  itemParent: ReceptionAvelonModel.Data;
  show: boolean;

  constructor(
    private reception: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService,
    private alertCtrl: AlertController,
    private virtualKeyboardService: VirtualKeyboardService,
    private productsService: ProductsService,
    private modalController: ModalController,
    private cd: ChangeDetectorRef,
    private cdRef : ChangeDetectorRef,
    private router: Router
  ) {}

  async loadProvider(){
    await this.load(null, this.providers.find((provider)=>{return provider.name == this.providerInput.nativeElement.value}));
  }

  changeShowCheck(){
    this.showCheck = true;
  }

  displayFn(provider: any): string {
    return provider && provider.name ? provider.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.providers.filter(provider => provider.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.intermediaryService.presentLoading('Cargando');
    this.response = new Reception();
    this.filterData = new Reception();
    this.typeScreen = undefined;
    this.isProviderAvailable = false;
    this.subscriptions = this.reception.getAllProviders().subscribe(
      (data: Array<ReceptionAvelonModel.Providers>) => {
        this.providers = data;
        this.providersAux = data;
      },
      e => {
        this.intermediaryService.dismissLoading();
      },
      () => {
        this.filteredProviders = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.providers.slice())
          );
        this.intermediaryService.dismissLoading();
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    clearInterval(this.interval);
  }

  ngAfterContentInit() {
    this.cd.detectChanges()
  }

  ngAfterViewInit() {
    this.listSelected()
    this.sizeSelected()
    this.show = false
    // this.cdRef.detectChanges()

  }

  openVirtualKeyboard(list?: Array<ReceptionAvelonModel.Data>, type?: Type) {
    const dataList = [];

    if(list) {
      list.forEach(item => {
        dataList.push({id: item.id, value: item.name});
      });
    }

    const keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter.subscribe(
      data => {
        let dato;
        if (data.selected) {
          switch (data.selected.type) {
            case Type.BRAND:
              dato = this.response.brands.find(elem => elem.id === data.selected.id);
              this.listsComponent.selected(dato);
              this.updateList(dato);
              // this.findAndSelectObject(this.response.brands, data.selected);
              break;
            case Type.COLOR:
              dato = this.response.colors.find(elem => elem.id === data.selected.id);
              this.listsComponent.selected(dato);
              this.updateList(dato);
              // this.findAndSelectObject(this.response.colors, data.selected);
              break;
            case Type.MODEL:
              dato = this.response.models.find(elem => elem.id === data.selected.id);
              this.listsComponent.selected(dato);
              this.updateList(dato);
              // this.findAndSelectObject(this.response.models, data.selected);
              break;
            case Type.PROVIDER:
              this.providerInput.nativeElement.value = data.selected.id;
              break;
            case Type.EXPEDITION_NUMBER:
              this.expeditionInput.nativeElement.value = data.selected.id;
              break;
            case undefined:
              this.expedition = data.selected.id;
              break;
          }
        }
      }
    );

    this.virtualKeyboardService
      .openVirtualKeyboard(dataList, type)
      .then((popover: any) => {
        popover.onDidDismiss().then(() => {
          keyboardEventEmitterSubscribe.unsubscribe();
        });
      });
  }

  findAndSelectObject(array: Array<ReceptionAvelonModel.Data>, selected: any) {
    let object = array.find(data => data.id === selected.id);
    if (object) {
      this.setSelected(array, object, selected.type);
    }
  }

  proveedorSelected(e, item) {
    if (e.detail.value) {
      this.providerId = e.detail.value;
      e.target.value = null;

      const data: ReceptionAvelonModel.CheckProvider = {
        expedition: this.expedition,
        providerId: this.providerId
      };

      if (data.expedition === undefined || data.expedition.length === 0) {
        this.alertMessage('El numero de expedicion no puede estar vacio');
        return;
      }

      this.checkProvider(data);
    }
  }

  checkProvider(data: ReceptionAvelonModel.CheckProvider) {
    this.intermediaryService.presentLoading('Cargando');
    this.reception.getReceptions(data.providerId).subscribe((info: ReceptionAvelonModel.Reception) => {
        this.response = info;
        this.response.brands = this.clearSelected(this.response.brands);
        this.response.models = this.clearSelected(this.response.models);
        this.response.colors = this.clearSelected(this.response.colors);
        this.response.sizes = this.clearSelected(this.response.sizes);
        this.filterData.brands = this.clearSelected(info.brands);
        this.filterData.models = this.clearSelected(info.models);
        this.filterData.colors = this.clearSelected(info.colors);
        this.filterData.sizes = this.clearSelected(info.sizes);

        this.reset();

        // this.ocrFake();
        if (info.brands.length > 0 && info.models.length > 0 && info.sizes.length > 0 && info.colors.length > 0) {
          // this.getOcr();
        }
        this.intermediaryService.dismissLoading();
      });
  }

  async alertMessage(message: string) {
    // Import the AlertController from ionic package
    // Consume it in the constructor as 'alertCtrl'
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  sizeSelected() {
    this.reception.getEmitList().subscribe((e:any) => {
      this.dato = e.dato;

      if (e && e.dato) {
        if(e.dato.selected){
          this.result.sizeId = e.dato.id;
        }
      } else {
        this.result.sizeId = undefined;
      }
    })
  }

  updateList(dato) {
    let model = [];
    let brand = [];
    let size = [];
    let color = [];
    let findResult;

    if (dato.belongsModels) {
      dato.belongsModels.forEach(modelId => {
        const modelsFilter = this.response.models.filter(model => model.id === modelId);
        modelsFilter.forEach(m => {
          const modelFind = model.find(elem => elem.id == m.id);
          if(modelFind === undefined) {
            if (m.state == 0) {
              model.push(m)
            } else {
              model.push(m)
            }

          }
        });
        /***************************brands******************************/
        const brandsFilter = this.response.brands.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        });
        brandsFilter.forEach(elem => {
          if(brand.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              brand.push(elem)
            } else {
              brand.push(elem)
            }
          }
        });

        /****************************sizes*****************************/
        const sizesFilter = this.response.sizes.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        });
        sizesFilter.forEach(elem => {
          if(size.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              size.push(elem)
            } else {
              size.push(elem)
            }
          }
        });
        /*****************************color****************************/
        const colorFilter = this.response.colors.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        });
        colorFilter.forEach(elem => {
          if(color.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              color.push(elem)
            } else {
              color.push(elem)
            }
          }
        })
      })
    } else {
      const modelsFilter = this.response.models.filter(model => model.id === dato.id);
        modelsFilter.forEach(m => {
          const modelFind = model.find(elem => elem.id == m.id);
          if(modelFind === undefined) {
            if (m.state == 0) {
              model.push(m)
            } else {
              model.push(m)
            }
          }
        });
         /***************************brands******************************/
         const brandsFilter = this.response.brands.filter(elem => {
          if(elem.belongsModels.find(elem => elem === dato.id)){
            return elem
          }
        });
        brandsFilter.forEach(elem => {
          if(brand.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              brand.push(elem)
            } else {
              brand.push(elem)
            }
          }
        });

        /****************************sizes*****************************/
        const sizesFilter = this.response.sizes.filter(elem => {
          if(elem.belongsModels.find(elem => elem === dato.id)){
            return elem
          }
        });
        sizesFilter.forEach(elem => {
          if(size.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              size.push(elem)
            } else {
              size.push(elem)
            }
          }
        });
        /*****************************color****************************/
        const colorFilter = this.response.colors.filter(elem => {
          if(elem.belongsModels.find(elem => elem === dato.id)){
            return elem
          }
        });
        colorFilter.forEach(elem => {
          if(color.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              color.push(elem)
            } else {
              color.push(elem)
            }
          }
        })
    }
    if (model.length > 0) {
      this.response.models = model;
      this.reception.setModelsList(model)
    }
    if (brand.length > 0) {
      this.response.brands = brand;
      this.reception.setBrandsList(brand)
    }
    if (color.length > 0) {
      this.response.colors = color;
      this.reception.setColorsList(color)
    }
    if (size.length > 0) {
      this.response.sizes = size;
      this.reception.setSizesList(size)
    }
  }


  reset(dato?: ReceptionAvelonModel.Data) {
    this.response.models = this.filterData.models;
    this.response.sizes = this.filterData.sizes;
    this.response.colors = this.filterData.colors;
    this.response.brands = this.filterData.brands;
    this.reception.setModelsList(this.response.models)
    this.reception.setBrandsList(this.response.brands)
    this.reception.setColorsList(this.response.colors)
    this.reception.setSizesList(this.response.sizes)
    this.show = false
  }

  resetAll() {
    this.response.models = this.filterData.models;
    this.response.models.map(elem => elem.selected = false);
    this.response.sizes = this.filterData.sizes;
    this.response.sizes.map(elem => elem.selected = false);
    this.response.colors = this.filterData.colors;
    this.response.colors.map(elem => elem.selected = false);
    this.response.brands = this.filterData.brands;
    this.response.brands.map(elem => elem.selected = false);
    this.result.modelId = undefined
    this.result.brandId = undefined
    this.result.sizeId = undefined
    this.result.colorId = undefined 
    this.show = false
    this.reception.setModelsList(this.response.models)
    this.reception.setBrandsList(this.response.brands)
    this.reception.setColorsList(this.response.colors)
    this.reception.setSizesList(this.response.sizes)
  }

  listSelected() {
    this.reception.getEmitList().subscribe((e:any) => {
      this.dato = e.dato;
      if (!this.result.modelId && !this.result.brandId && !this.result.colorId) {
        this.itemParent = this.dato;
      }

      switch (e.type) {
        case 'brands':
          if (e.dato.selected) {
            this.result.brandId = e.dato.id;
            const timeout = setTimeout(() => {
              this.updateList(this.dato);
            }, 0);
          } else {
            this.result.brandId = undefined;

            if (this.dato.id === this.itemParent.id) {
              this.reset();
            }
          }
          break;
        case 'models':
          if (e.dato.selected) {
            this.result.modelId = e.dato.id;
            const timeout = setTimeout(() => {
              this.updateList(this.dato);
            }, 0);
          } else {
            this.result.modelId = undefined;

            if (this.dato.id === this.itemParent.id) {
              this.reset();
            }
          }
          break;
        case 'colors':
          if (e.dato.selected) {
            this.result.colorId = e.dato.id;
            const timeout = setTimeout(() => {
              this.updateList(this.dato);
            }, 0);
          } else {
            this.result.colorId = undefined;
            if (this.dato.id === this.itemParent.id) {
              this.reset();
            }
          }
          break;
      }
    });
  }

  enviar() {
    if (!this.result.brandId) {
      this.alertMessage('Debe seleccionar una marca');
      return;
    }
    if (!this.result.colorId) {
      this.alertMessage('Debe seleccionar un color');
      return;
    }
    if (!this.result.modelId) {
      this.alertMessage('Debe seleccionar un modelo');
      return;
    }
    if (!this.result.sizeId) {
      this.alertMessage('Debe seleccionar una talla');
      return;
    }
    if (!this.result.ean) {
      // this.alertMessage('Debe introducir un EAN');
      delete this.result.ean;
      // return;
    }
    this.result.providerId = this.providerId;
    this.result.expedition = this.expedition;

    this.intermediaryService.presentLoading('Enviando');
    const body = {
      modelId: this.result.modelId,
      colorId: this.result.colorId,
      sizeId: this.result.sizeId
    };
    this.reception.printReceptionLabel(this.result).subscribe(
      resp => {
        this.reception.getReceptions(this.providerId).subscribe(
          (info: ReceptionAvelonModel.Reception) => {
            this.response = info;
            this.response.brands = this.clearSelected(this.response.brands);
            this.response.models = this.clearSelected(this.response.models);
            this.response.colors = this.clearSelected(this.response.colors);
            this.response.sizes = this.clearSelected(this.response.sizes);
            this.typeScreen = resp.type;
            this.intermediaryService.dismissLoading();
          },
          () => {
            this.typeScreen = resp.type
          }
        );
      },
      e => {
        this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError(e.error.errors)
      },
      () => {
        this.intermediaryService.dismissLoading();
      }
    );
  }

  ocrFake() {

  }

  async getOcr() {
    const seg = 10000;

    this.interval = setInterval(async () => {
      const ocrModels: Array<any> = await this.reception.ocrModels().toPromise();
      const ocrBrands: Array<any> = await this.reception.ocrBrands().toPromise();
      const ocrSizes: Array<any> = await this.reception.ocrSizes().toPromise();
      const ocrColors: Array<any> = await this.reception.ocrColors().toPromise();

      this.addOrcData(ocrModels, 'models');
      this.addOrcData(ocrBrands, 'brands');
      this.addOrcData(ocrSizes, 'sizes');
      this.addOrcData(ocrColors, 'colors');
      this.reset();
      if (this.dato) {
        this.updateList(this.dato);
      }
    }, seg);
  }
  addOrcData(sourceArray: Array<any>, collection: string) {
    sourceArray.forEach(elem => {
      const find = this.filterData[collection].find(
        data => data.id === elem.id
      );
      if (undefined === find) {
        this.filterData[collection].push(elem);
      }
    });
  }

  clearSelected(array: Array<ReceptionAvelonModel.Data>) {
    array.map(element => {
      element.state = 0;
      if (element.selected) {
        element.selected = false;
      }
    });
    return array;
  }

  setSelected(array: Array<ReceptionAvelonModel.Data>, data: any, type?: number) {
    const findIndexResult: number = array.findIndex(
      element => element.id === data.id
    );
    if (findIndexResult >= 0) {
      array[findIndexResult].selected = true;
    } else {
      data.seleted = true;
      array.push(data);
    }

    if (type === Type.BRAND) {
      // brand
      this.result.brandId = data.id;
    }
    if (type === Type.COLOR) {
      // color
      this.result.colorId = data.id;
    }
    if (type === Type.MODEL) {
      //model

      this.result.modelId = data.id;
    }
    if (type === Type.SIZE) {
      // size
      this.result.sizeId = data.id;
    }

    return data;
  }

  buscarMas() {
    this.resetAll()
    this.getReceptionsNotifiedProviders$ = this.reception
      .getReceptionsNotifiedProviders(this.providerId)
      .subscribe((data: ReceptionAvelonModel.Reception) => {

        this.response.brands = this.mappingReceptionsNotifiedProvidersLists(
          data.brands,
          this.response.brands
        );
        this.response.colors = this.mappingReceptionsNotifiedProvidersLists(
          data.colors,
          this.response.colors
        );
        this.response.models = this.mappingReceptionsNotifiedProvidersLists(
          data.models,
          this.response.models
        );
        this.response.sizes = this.mappingReceptionsNotifiedProvidersLists(
          data.sizes,
          this.response.sizes
        );
      });
  }

  mappingReceptionsNotifiedProvidersLists(data: Array<ReceptionAvelonModel.Data>, array: Array<ReceptionAvelonModel.Data>) {
    data.map(element => {
      element.state = 1;
      const findIndexResult: number = array.findIndex(
        item => item.id === element.id
      );
      if (findIndexResult >= 0) {
        if (element.newSelectd) {
          array[findIndexResult].newSelectd = element.newSelectd;
        }
      } else {
        element.newSelectd = true;
        array.push(element);
      }
    });
    return array;
  }

  onKey(e) {
    if (e.keyCode == 13) {
      this.intermediaryService.presentLoading('Enviando');

      this.reception.eanProductPrint(this.result.ean, this.expedition, this.providerId).subscribe(
        result => {
          this.reception.getReceptions(this.providerId).subscribe(
            (info: ReceptionAvelonModel.Reception) => {
              this.response = info;
              this.response.brands = this.clearSelected(this.response.brands);
              this.response.models = this.clearSelected(this.response.models);
              this.response.colors = this.clearSelected(this.response.colors);
              this.response.sizes = this.clearSelected(this.response.sizes);
              this.typeScreen = result.type;
              this.intermediaryService.dismissLoading();
            },
            () => {
              this.typeScreen = result.type

          })
        },
        e =>  {
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError(e.error.errors)
        }
      )

    }
  }

  screenExit(e) {
    this.typeScreen = undefined;
  }

  async load(e, item) {
    this.expedition = this.expeditionInput && this.expeditionInput.nativeElement && this.expeditionInput.nativeElement.value ? this.expeditionInput.nativeElement.value : null;
    this.value = item.name;
    this.filter = false;
    this.providerId = item.id;
    const data: ReceptionAvelonModel.CheckProvider = {
      expedition: this.expedition,
      providerId: this.providerId
    };

    if (data.expedition === undefined || data.expedition.length === 0) {
      this.alertMessage('Introduzca un número de expedición para poder iniciar la recepción.');
    } else {
      await this.reception.checkExpeditionsByNumberAndProvider({
        expeditionNumber: data.expedition,
        providerId: data.providerId
      }).subscribe(async (response) => {
        if(response.data.expedition_available) {
          const modal = await this.modalController.create({
            component: InfoModalComponent,
            componentProps: {
              expedition: response.data.expedition,
              anotherExpeditions: response.data.another_expeditions
            }
          });

          modal.onDidDismiss().then(response => {
            if (response.data && response.data.reception) {
              this.showCheck = false;
              this.isProviderAvailable = true;
              this.checkProvider(data);
            }
          });

          modal.present();
        }else{
          this.isProviderAvailable = false;
          this.alertMessage('No se ha encontrado esa expedición');
        }
      });
    }
  }

  optionClick(e) {}

  changeProvider(e) {
    const value: string = e.detail.value;
    this.providers = this.providersAux;

    // if the value is an empty string don't filter the items
    if (value && value.trim() != '') {
      this.providers = this.providers.filter(item => {
        return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    }
  }

  providerFocus() {
    this.filter = true;
  }

  providerBlur(e) {
    setTimeout(()=> {
      this.filter = false;
    }, 500)
  }

  naturalSorter(as, bs){

  }
}
