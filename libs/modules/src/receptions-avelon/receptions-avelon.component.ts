import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import {
  ReceptionsAvelonService,
  ReceptionAvelonModel,
  IntermediaryService,
  ProductsService
} from '@suite/services';
import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Type } from './enums/type.enum';
import { VirtualKeyboardService } from '../components/virtual-keyboard/virtual-keyboard.service';
import { Reception } from './classes/reception.class';
import { ListsComponent } from './components/lists/lists.component';

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss'],
})


export class ReceptionsAvelonComponent implements OnInit, OnDestroy, AfterViewInit{


  response: ReceptionAvelonModel.Reception;
  dato: ReceptionAvelonModel.Data;
  subscriptions: Subscription;
  providers: Array<any>;
  isProviderAviable: boolean;
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
  show: boolean
  itemParent: ReceptionAvelonModel.Data

  constructor(
    private reception: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService,
    private alertCtrl: AlertController,
    private virtualKeyboardService: VirtualKeyboardService,
    private productsService: ProductsService,
    private cdRef : ChangeDetectorRef,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.intermediaryService.presentLoading('Cargando');
    this.response = new Reception();
    console.log(this.response);
    
    this.filterData = new Reception();
    this.typeScreen = undefined;
    this.isProviderAviable = false;
    this.subscriptions = this.reception.getAllProviders().subscribe(
      (data: Array<ReceptionAvelonModel.Providers>) => {
        this.providers = data;
        this.providersAux = data;
      },
      e => {
        this.intermediaryService.dismissLoading();
      },
      () => {
        this.intermediaryService.dismissLoading();
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    clearInterval(this.interval);
  }

  ngAfterViewInit() {
    this.listSelected()
    this.sizeSelected()
    this.show = false
    // this.cdRef.detectChanges()

  }
  openVirtualKeyboard(list: Array<ReceptionAvelonModel.Data>, type: Type) {
    const dataList = [];

    list.forEach(item => {
      dataList.push({ id: item.id, value: item.name });
    });

    const keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter.subscribe(
      data => {
        let dato;
        if (data.selected) {
          switch (data.selected.type) {
            case Type.BRAND:
              dato = this.response.brands.find(elem => elem.id === data.selected.id)
              // this.listsComponent.selected(dato)
              this.updateList(dato)
              // this.findAndSelectObject(this.response.brands, data.selected);
              break;
            case Type.COLOR:
              dato = this.response.colors.find(elem => elem.id === data.selected.id)
              // this.listsComponent.selected(dato)
              this.updateList(dato)
              // this.findAndSelectObject(this.response.colors, data.selected);
              break;
            case Type.MODEL:
              dato = this.response.models.find(elem => elem.id === data.selected.id)
              // this.listsComponent.selected(dato)
              this.updateList(dato)
              // this.findAndSelectObject(this.response.models, data.selected);
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
    // if (this.interval) {
    //   clearInterval(this.interval);
    // }
    this.intermediaryService.presentLoading('Cargando');
    this.reception.isProviderAvailable(data).subscribe(
      (resp: boolean) => {
        this.isProviderAviable = resp;
        if (!this.isProviderAviable) {
          this.alertMessage(
            'Este proveedor no esta habilitado para recepcionar'
          );
        } else {
          this.reception
            .getReceptions(data.providerId)
            .subscribe((info: ReceptionAvelonModel.Reception) => {
              let array = [];
              let i =0;
              info.models.forEach(data => {
                 array[i] = {
                   id:data.id,
                   name:data.name.trim(),
                   newSelectd:data.newSelectd,
                   selected:data.selected,
                   state:data.state,
                   belongsModels:data.belongsModels
                 }
                 i++;
              });
              info.models = array;
              info.models.sort(function(a,b) {

                if (a.name > b.name) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });

              console.log(info.models);

              info.brands.sort(function(a,b) {
                if (a.name > b.name) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });

    
              info.colors.sort(function(a,b) {
                if (a.name > b.name) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });
              // console.log(info.models);
              // info.models.sort((a:any, b:any) => a.name - b.name);
              // info.brands.sort((a:any, b:any) => a.name - b.name);
              // info.colors.sort((a:any, b:any) => a.name - b.name);
              this.response = info;
              this.response.brands = this.clearSelected(this.response.brands);
              this.response.models = this.clearSelected(this.response.models);
              this.response.colors = this.clearSelected(this.response.colors);
              this.response.sizes = this.clearSelected(this.response.sizes);
              this.filterData.brands = this.clearSelected(info.brands)
              this.filterData.models = this.clearSelected(info.models)
              this.filterData.colors = this.clearSelected(info.colors)
              this.filterData.sizes = this.clearSelected(info.sizes)
              this.reception.setModelsList(this.response.models)
              this.reception.setBrandsList(this.response.brands)
              this.reception.setColorsList(this.response.colors)
              this.reception.setSizesList(this.response.sizes)

              // this.ocrFake();
              if (info.brands.length > 0 && info.models.length > 0 && info.sizes.length > 0 && info.colors.length > 0) {
                // this.getOcr();
              }
            });
        }
      },
      e => {
        this.intermediaryService.dismissLoading();
      },
      () => {
        this.intermediaryService.dismissLoading();
      }
    );
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
      console.log(e);
      
      console.log(this.dato);
      if (e && e.dato) {
        if(e.dato.selected){
          this.result.sizeId = e.dato.id;
          // const interval = setTimeout(() => {
          //   this.updateList(this.dato);
          // }, 0);
        }
      } else {
        this.result.sizeId = undefined;
        // this.reset();
      }

    })
  }
  updateList(dato) {    
    let model = [];
    let brand = [];
    let size = [];
    let color = [];
    let findResult;
    // console.log(dato);
    
    if (dato.belongsModels) {
      dato.belongsModels.forEach(modelId => {
        const modelsFilter = this.response.models.filter(model => model.id === modelId)
        modelsFilter.forEach(m => {
          const modelFind = model.find(elem => elem.id == m.id)
          if(modelFind === undefined) {
            if (m.state == 0) {
              model.push(m)
            } else {
              model.push(m)
            }
            
          }
        })
        /***************************brands******************************/
        const brandsFilter = this.response.brands.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        })
        brandsFilter.forEach(elem => {
          if(brand.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              brand.push(elem)
            } else {
              brand.push(elem)
            }
          }
        })
        
        /****************************sizes*****************************/
        const sizesFilter = this.response.sizes.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        })
        sizesFilter.forEach(elem => {
          if(size.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              size.push(elem)
            } else {
              size.push(elem)
            }
          }
        })
        /*****************************color****************************/
        const colorFilter = this.response.colors.filter(elem => {
          if(elem.belongsModels.find(elem => elem === modelId)){
            return elem
          }
        })
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
      const modelsFilter = this.response.models.filter(model => model.id === dato.id)
        modelsFilter.forEach(m => {
          const modelFind = model.find(elem => elem.id == m.id)
          if(modelFind === undefined) {
            if (m.state == 0) {
              model.push(m)
            } else {
              model.push(m)
            }
          }
        })
         /***************************brands******************************/
         const brandsFilter = this.response.brands.filter(elem => {
          if(elem.belongsModels.find(elem => elem === dato.id)){
            return elem
          }
        })
        brandsFilter.forEach(elem => {
          if(brand.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              brand.push(elem)              
            } else {
              brand.push(elem)
            }
          }
        })
        
        /****************************sizes*****************************/
        const sizesFilter = this.response.sizes.filter(elem => {
          if(elem.belongsModels.find(elem => elem === dato.id)){
            return elem
          }
        })
        sizesFilter.forEach(elem => {
          if(size.find(data => data.id === elem.id) === undefined) {
            if (elem.state == 0) {
              size.push(elem)
            } else {
              size.push(elem)
            }
          }
        })
        /*****************************color****************************/
        const colorFilter = this.response.colors.filter(elem => {
          if(elem.belongsModels.find(elem => elem === dato.id)){
            return elem
          }
        })
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
      console.log('size',size);
      this.response.sizes = size;
      this.reception.setSizesList(size)
    }
    
    // console.log('model',model);
    // console.log('brand',brand);
    // console.log('color',color);
    // console.log('size',size);
    
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

  returnHome(){
    this.expedition="";
    this.provid="";
    this.ngOnInit();
  }

  listSelected() {
    
    this.reception.getEmitList().subscribe((e:any) => {
      this.dato = e.dato;
      console.log(this.dato);
      if (!this.result.modelId && !this.result.brandId && !this.result.colorId) {
        this.itemParent = this.dato
        console.log(this.itemParent);
        
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
            console.log(this.dato.id === this.itemParent.id);
            
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
            console.log(this.dato.id === this.itemParent.id);
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
            console.log(this.dato.id === this.itemParent.id);
            this.result.colorId = undefined;
            if (this.dato.id === this.itemParent.id) {
              this.reset();
            }
          }
          break;
      }
      this.showSize()
    })
   
  }
  showSize(){
    if (this.result.brandId && this.result.modelId && this.result.colorId) {
      this.show = true
    } else {
      this.show = false
    }
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
            this.typeScreen = resp.type
            // console.log(this.typeScreen);
            this.intermediaryService.dismissLoading();
          },
          () => {
            this.typeScreen = resp.type
            // console.log(this.typeScreen);
          }
        );
      },
      e => {
        // console.log(e.error);
        this.intermediaryService.dismissLoading();
        // if( e.error.errors.statusMessage){
        //   this.intermediaryService.presentToastError(e.error.errors.statusMessage)
        // }
          this.intermediaryService.presentToastError(e.error.errors)

        
        
      },
      () => {
        this.intermediaryService.dismissLoading();
      }
    );
  }

  ocrFake() {
    // const seg: number = 30000;
    // this.interval = setInterval(() => {
    //   this.reception.ocrFake().subscribe(resp => {
    //     this.response.brands = this.clearSelected(this.response.brands);
    //     this.response.colors = this.clearSelected(this.response.colors);
    //     this.response.models = this.clearSelected(this.response.models);
    //     this.response.sizes = this.clearSelected(this.response.sizes);

    //     if (resp.ean) {
    //       this.result.ean = resp.ean;
    //       this.reception.eanProduct(resp.ean).subscribe(resp => {
    //         this.setSelected(this.response.brands, resp.brand, Type.BRAND);
    //         this.setSelected(this.response.colors, resp.color, Type.COLOR);
    //         this.setSelected(this.response.models, resp.model, Type.MODEL);
    //         this.setSelected(this.response.sizes, resp.size, Type.SIZE);
    //       });
    //     } else {
    //       if (resp.brand) {
    //         this.setSelected(this.response.brands, resp.brand, Type.BRAND);
    //       }
    //       if (resp.color) {
    //         this.setSelected(this.response.colors, resp.color, Type.COLOR);
    //       }
    //       if (resp.model) {
    //         this.setSelected(this.response.models, resp.model, Type.MODEL);
    //       }
    //       if (resp.size) {
    //         this.setSelected(this.response.sizes, resp.size, Type.SIZE);
    //       }
    //     }
    //   });
    // }, seg);
  }

  async getOcr() {
    const seg = 10000;

    this.interval = setInterval(async () => {
      const ocrModels: Array<any> = await this.reception.ocrModels().toPromise();
      const ocrBrands: Array<any> = await this.reception.ocrBrands().toPromise();
      const ocrSizes: Array<any> = await this.reception.ocrSizes().toPromise();
      const ocrColors: Array<any> = await this.reception.ocrColors().toPromise();
      // // console.log(ocrColors);
      // // console.log(this.filterData);

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
      if (element.selected) {
        element.selected = false;
      }
    });
    return array;
  }

  setSelected(
    array: Array<ReceptionAvelonModel.Data>,
    data: any,
    type?: number
  ) {
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

  mappingReceptionsNotifiedProvidersLists(
    data: Array<ReceptionAvelonModel.Data>,
    array: Array<ReceptionAvelonModel.Data>
  ) {
    data.map(element => {
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
      // this.response.brands = this.clearSelected(this.response.brands);
      // this.response.colors = this.clearSelected(this.response.colors);
      // this.response.models = this.clearSelected(this.response.models);
      // this.response.sizes = this.clearSelected(this.response.sizes);

      // this.reception.eanProduct(this.result.ean).subscribe(resp => {
      //   this.setSelected(this.response.brands, resp.brand, Type.BRAND);
      //   this.setSelected(this.response.colors, resp.color, Type.COLOR);
      //   this.setSelected(this.response.models, resp.model, Type.MODEL);
      //   this.setSelected(this.response.sizes, resp.size, Type.SIZE);
      // });

      // console.log(this.result.ean);
      // console.log(this.result.expedition);
      // console.log(this.result.providerId);
      
      this.reception.eanProductPrint(this.result.ean, this.expedition, this.providerId).subscribe(
        result => {
          this.reception.getReceptions(this.providerId).subscribe(
            (info: ReceptionAvelonModel.Reception) => {
              this.response = info;
              this.response.brands = this.clearSelected(this.response.brands);
              this.response.models = this.clearSelected(this.response.models);
              this.response.colors = this.clearSelected(this.response.colors);
              this.response.sizes = this.clearSelected(this.response.sizes);
              this.typeScreen = result.type
              // console.log(this.typeScreen);
              this.intermediaryService.dismissLoading();
            },
            () => {
              this.typeScreen = result.type
              // console.log(this.typeScreen);
              
          })
        },
        e =>  {
          // console.log(e.error);
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError(e.error.errors)
        }
      )

    }
  }

  screenExit(e) {
    this.typeScreen = undefined;
  }

  changeProvider(e) {
    const value: string = e.detail.value;
    // if (value.length > 0) {
    //   this.filter = true
    // } else {
    //   this.filter = false
    // }
    // // console.log(this.filter);
    this.providers = this.providersAux;

    // if the value is an empty string don't filter the items
    if (value && value.trim() != '') {
      this.providers = this.providers.filter(item => {
        return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    }
  }

  load(e,item) {
    // // console.log(e);
    this.value = item.name;
    this.filter = false;
    this.providerId = item.id;
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
  providerFocus() {
    this.filter = true;
  }
  providerBlur(e) {
    // // console.log(e)
    // if (this.value) {
    //   this.filter = false;
    // }
    setTimeout(()=> {
      this.filter = false;
    }, 500)
    
  }

  naturalSorter(as, bs){
    
}
}
