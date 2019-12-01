import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ReceptionsAvelonService, ReceptionAvelonModel, IntermediaryService } from '@suite/services';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss']
})
export class ReceptionsAvelonComponent implements OnInit, OnDestroy {
  response: ReceptionAvelonModel.Reception;
  subscriptions: Subscription;
  providers: Array<any>
  isProviderAviable: boolean
  expedition: string;
  providerId:  number;
  interval: any;

  result = {
    brandId: undefined,
    colorId: undefined,
    sizeId: undefined,
    modelId: undefined,
    providerId: undefined,
    expetition: '',
    ean: ''
  }

  constructor(
    private reception: ReceptionsAvelonService,
    private intermediaryService:IntermediaryService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.intermediaryService.presentLoading('Cargando')
    this.response = {
      brands: [],
      models: [],
      sizes:  [],
      colors: [],
      ean:    ''
    }


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
    )

    

    // this.subscriptions.add(receptions)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    clearInterval(this.interval)
  }


  proveedorSelected(e) {
    this.providerId = e.detail.value;
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

  checkProvider(data: ReceptionAvelonModel.CheckProvider) {
    this.intermediaryService.presentLoading('Cargando')
    this.reception.isProviderAviable(data).subscribe(
      (resp: boolean) => {
        this.isProviderAviable = !resp;
        // console.log(resp);
        
        if (!this.isProviderAviable) {
          this.alertMessage('Este proveedor no esta habilitado para recepcionar');
        }else {
          this.interval = setInterval(() => {
            this.reception.getReceptions().subscribe((info: ReceptionAvelonModel.Reception)  => {
              this.response = info;
              // console.log(this.response);
              let aux
              this.response.brands.map(elem => {
                if (elem.selected === true && aux === undefined) {
                  aux = elem.id
                  this.result.brandId = aux;
                }
                if (aux !== elem.id) {
                  elem.selected = false
                }
              })
              aux = undefined;
              this.response.models.map(elem => {
                if (elem.selected === true && aux === undefined) {
                  aux = elem.id;
                  this.result.modelId = aux;
                }
                if (aux !== elem.id) {
                  elem.selected = false
                }
              })
              aux = undefined;
              this.response.colors.map(elem => {
                if (elem.selected === true && aux === undefined) {
                  aux = elem.id;
                  this.result.colorId = aux;
                }
                if (aux !== elem.id) {
                  elem.selected = false
                }
              })
              aux = undefined;
              this.response.sizes.map(elem => {
                if (elem.selected === true && aux === undefined) {
                  aux = elem.id;
                  this.result.sizeId = aux;
                }
                if (aux !== elem.id) {
                  elem.selected = false
                }
              })
            })
          },1000);
         
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
    // console.log(e);
    if(e){
      this.result.sizeId = e.id
    } else {
      this.result.sizeId = undefined
    }
    
  }

  listSelected(e: any) {
    // console.log(e);
    switch (e.type) {
      case 'brands':
          if(e.dato){
            this.result.brandId = e.dato.id
          } else {
            this.result.brandId = undefined
          }
        break;
      case 'models':
          if(e.dato){
            this.result.modelId = e.dato.id
          } else {
            this.result.modelId = undefined
          }
        break;
      case 'colors':
          if(e.dato){
            this.result.colorId = e.dato.id
          } else {
            this.result.colorId = undefined
          }
        break;
    
    }
    // console.log(e);
    
  }

  enviar(){
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
    this.result.providerId = this.providerId
    this.result.ean = this.response.ean;
    this.result.expetition = this.expedition;

    // console.log(this.result);
    

    this.intermediaryService.presentLoading('Enviando');
    setTimeout(() => {
      this.intermediaryService.dismissLoading()
    }, 3000);
  }

}
