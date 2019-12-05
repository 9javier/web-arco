import { AlertController, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ReceptionsAvelonService, ReceptionAvelonModel, IntermediaryService } from '@suite/services';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { VirtualKeyboardComponent } from '../components/virtual-keyboard/virtual-keyboard.component';
import { VirtualKeyboardService } from '../components/virtual-keyboard/virtual-keyboard.service';

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss']
})
export class ReceptionsAvelonComponent implements OnInit, OnDestroy {
  response: ReceptionAvelonModel.Reception;
  subscriptions: Subscription;
  providers: Array<any>;
  isProviderAviable: boolean;
  expedition: string;
  providerId: number;
  interval: any;
  option:any;

  result: ReceptionAvelonModel.Print = {
    brandId: undefined,
    colorId: undefined,
    sizeId: undefined,
    modelId: undefined,
    providerId: undefined,
    expedition: '',
    ean: ''
  };

  getReceptionsNotifiedProviders$: Subscription;

  constructor(
    private reception: ReceptionsAvelonService,
    private intermediaryService: IntermediaryService,
    private alertCtrl: AlertController,
    private virtualKeyboardService: VirtualKeyboardService,
  ) { }

  ngOnInit() {
    this.intermediaryService.presentLoading('Cargando');
    this.response = {
      brands: [],
      models: [],
      sizes: [],
      colors: [],
      ean: ''
    };

    this.isProviderAviable = false;
    this.subscriptions = this.reception.getAllProviders().subscribe((data: Array<ReceptionAvelonModel.Providers>) => {
      this.providers = data;
    },
      e => {
        this.intermediaryService.dismissLoading()
      },
      () => {
        this.intermediaryService.dismissLoading()
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    clearInterval(this.interval)
  }

  openVirtualKeyboard(list: Array<ReceptionAvelonModel.Data>, type: number) {
    const dataList = [];

    list.forEach((item) => {
      dataList.push({ id: item.id, value: item.name })
    });

    const keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter.subscribe((data) => {
      if (data.selected) {
        console.log('EVENT EMITTER');
        console.log(data);
      }
    });

    this.virtualKeyboardService.openVirtualKeyboard(dataList, type).then((popover: any) => {
      popover.onDidDismiss().then(() => {
        keyboardEventEmitterSubscribe.unsubscribe();
      });
    });
  }

  proveedorSelected(e, item) {
    console.log(e);
    if (e.detail.value) {
      this.providerId = e.detail.value;
      e.target.value = null

      const data: ReceptionAvelonModel.CheckProvider = {
        expedition: this.expedition,
        providerId: this.providerId
      }

      if (data.expedition === undefined || data.expedition.length === 0) {
        this.alertMessage('El numero de expedicion no puede estar vacio');
        return
      }
      // console.log(data);

      this.checkProvider(data)
    }
  }

  optionClick(e) {
    console.log(e);

  }

  checkProvider(data: ReceptionAvelonModel.CheckProvider) {
    this.intermediaryService.presentLoading('Cargando')
    this.reception.isProviderAviable(data).subscribe(
      (resp: boolean) => {
        this.isProviderAviable = resp;
        // console.log(resp);

        if (!this.isProviderAviable) {
          this.alertMessage('Este proveedor no esta habilitado para recepcionar');
        } else {
          this.reception.getReceptions(data.providerId).subscribe((info: ReceptionAvelonModel.Reception) => {
            this.response = info;
            this.response.brands = this.clearSelected(this.response.brands);
            this.response.models = this.clearSelected(this.response.models);
            this.response.colors = this.clearSelected(this.response.colors);
            this.response.sizes = this.clearSelected(this.response.sizes);
            this.ocrFake();
          })
        }

      },
      e => {
        this.intermediaryService.dismissLoading()
      },
      () => {
        this.intermediaryService.dismissLoading()
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

  sizeSelected(e) {
    if (e) {
      this.result.sizeId = e.id
    } else {
      this.result.sizeId = undefined
    }

  }

  listSelected(e: any) {
    switch (e.type) {
      case 'brands':
        if (e.dato) {
          this.result.brandId = e.dato.id
        } else {
          this.result.brandId = undefined
        }
        break;
      case 'models':
        if (e.dato) {
          this.result.modelId = e.dato.id
        } else {
          this.result.modelId = undefined
        }
        break;
      case 'colors':
        if (e.dato) {
          this.result.colorId = e.dato.id
        } else {
          this.result.colorId = undefined
        }
        break;

    }
  }

  enviar() {
    if (!this.result.brandId) {
      this.alertMessage('Debe seleccionar una marca');
      return
    }
    if (!this.result.colorId) {
      this.alertMessage('Debe seleccionar un color');
      return
    }
    if (!this.result.modelId) {
      this.alertMessage('Debe seleccionar un modelo');
      return
    }
    if (!this.result.sizeId) {
      this.alertMessage('Debe seleccionar una talla');
      return
    }
    if (!this.result.ean) {
      this.alertMessage('Debe introducir un EAN');
      return
    }
    this.result.providerId = this.providerId
    this.result.expedition = this.expedition;


    this.intermediaryService.presentLoading('Enviando');

    this.reception.printReceptionLabel(this.result).subscribe(
      () => {
        this.reception.getReceptions(this.providerId).subscribe((info: ReceptionAvelonModel.Reception) => {
          this.response = info;
          this.response.brands = this.clearSelected(this.response.brands);
          this.response.models = this.clearSelected(this.response.models);
          this.response.colors = this.clearSelected(this.response.colors);
          this.response.sizes = this.clearSelected(this.response.sizes);
        })
      },
      e => {
        console.log(e);
        this.intermediaryService.dismissLoading()
      },
      () => {
        this.intermediaryService.dismissLoading()
      }
    );
  }

  ocrFake(){
    const seg: number = 30000;
    this.interval = setInterval(() => {
      this.reception.ocrFake().subscribe(resp => {
        this.response.brands = this.clearSelected(this.response.brands);
        this.response.colors = this.clearSelected(this.response.colors);
        this.response.models = this.clearSelected(this.response.models);
        this.response.sizes = this.clearSelected(this.response.sizes);

        if(resp.ean) {
          this.result.ean = resp.ean;
          this.reception.eanProduct(resp.ean).subscribe(resp => {
            this.setSelected(this.response.brands, resp.brand, 1);
            this.setSelected(this.response.colors, resp.color, 2);
            this.setSelected(this.response.models, resp.model, 3);
            this.setSelected(this.response.sizes, resp.size, 4);
          })
        }else {
          if(resp.brand) {
            this.setSelected(this.response.brands, resp.brand, 1);
          }
          if(resp.color) {
            this.setSelected(this.response.colors, resp.color, 2);
          }
          if(resp.model) {
            this.setSelected(this.response.models, resp.model, 3);
          }
          if(resp.size) {
            this.setSelected(this.response.sizes, resp.size, 4);
          }
        }


      });
    }, seg);
  }

  clearSelected(array: Array<ReceptionAvelonModel.Data>) {
    array.map(element => {
      if(element.selected){
        element.selected = false
      }
    })
    return array;
  }

  setSelected(array: Array<ReceptionAvelonModel.Data>, data: any, type?: number) {
    console.log(data);

    const findIndexResult: number = array.findIndex(element => element.id === data.id);
    if (findIndexResult >= 0) {
      array[findIndexResult].selected = true
    } else {
      data.seleted = true;
      array.push(data);
    }
    if (type === 1) {
      console.log('estoy en brand');

      this.result.brandId = data.id
    }
    if (type === 2) {
      console.log('estoy en color');

      this.result.colorId = data.id
    }
    if (type === 3) {
      console.log('estoy en model');

      this.result.modelId = data.id
    }
    if (type === 4) {
      console.log('estoy en size');

      this.result.sizeId = data.id
    }

    return data;
  }

  buscarMas() {
    this.getReceptionsNotifiedProviders$ = this.reception.getReceptionsNotifiedProviders(this.providerId).subscribe((data: ReceptionAvelonModel.Reception) => {
      this.response.brands = this.mappingReceptionsNotifiedProvidersLists(data.brands, this.response.brands);
      this.response.colors = this.mappingReceptionsNotifiedProvidersLists(data.colors, this.response.colors);
      this.response.models = this.mappingReceptionsNotifiedProvidersLists(data.models, this.response.models);
      this.response.sizes = this.mappingReceptionsNotifiedProvidersLists(data.sizes, this.response.sizes);
    });
  }

  mappingReceptionsNotifiedProvidersLists(data: Array<ReceptionAvelonModel.Data>, array: Array<ReceptionAvelonModel.Data>) {
    data.map(element => {
      const findIndexResult: number = array.findIndex(item => item.id === element.id);
      if (findIndexResult >= 0) {
        if (element.newSelectd) {
          array[findIndexResult].newSelectd = element.newSelectd
        }
      } else {
        element.newSelectd = true
        array.push(element)
      }

    })
    return array;
  }

  onKey(e){
    if (e.keyCode == 13) {
      console.log('enter');

      this.response.brands = this.clearSelected(this.response.brands);
      this.response.colors = this.clearSelected(this.response.colors);
      this.response.models = this.clearSelected(this.response.models);
      this.response.sizes = this.clearSelected(this.response.sizes);


      this.reception.eanProduct(this.result.ean).subscribe(resp => {
          this.setSelected(this.response.brands, resp.brand, 1);
          this.setSelected(this.response.colors, resp.color, 2);
          this.setSelected(this.response.models, resp.model, 3);
          this.setSelected(this.response.sizes, resp.size, 4);
      })
    }

  }
}
