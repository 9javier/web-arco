import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Route, Router } from '@angular/router';
import { CarrierService, IntermediaryService } from '@suite/services';
import { AudioProvider } from 'libs/services/src/providers/audio-provider/audio-provider.provider';

@Component({
  selector: 'suite-listas-productos',
  templateUrl: './listas-productos.component.html',
  styleUrls: ['./listas-productos.component.scss']
})
export class ListasProductosComponent implements OnInit {
  @Input() data:any;
  @Input() jaula:any;
  @Input() productos:any;
  visible:boolean;
  column = [
    {name:'Refencia',size:"4"},
    {name:'Modello', size:"3"},
    {name:'Talla',   size:"2"},
    {name:'Color',   size:"3"}
  ]
  

  constructor(
    private modalControler: ModalController,
    private route: Router,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService,
    private audioProvider: AudioProvider,
  ) { }

  ngOnInit() {
    console.log(this.data);
    console.log(this.jaula);
    console.log(this.productos);
    this.visible$(this.route.url);
  }

  async visible$(url:string){
    if(url === '/positioning/manual'){
      this.visible = false;
    }else{
      this.visible = true;
    }
  }

  async close(con = false){
    if(con){
      this.modalControler.dismiss(this.jaula);
    }else{
      this.modalControler.dismiss();

    }
  };

  async navigate(ruta:string){
    console.log(ruta);

    this.route.navigateByUrl(ruta);
    this.modalControler.dismiss(ruta,'navigate')
    
  }

  async vaciar(){
    // TODO llamar el metodo vaciarCalle
    this.intermediaryService.presentLoading();
    await this.carrierService.postPackingEmpty(this.jaula).then(res => {
      if(res.code === 200){
        this.audioProvider.playDefaultOk();
        this.intermediaryService.presentToastSuccess(`La Jaula ${this.jaula} se ha vaciado corectamente`);
      }
      if(res.code !== 200){
        this.audioProvider.playDefaultError();
        this.intermediaryService.presentToastError(res.errors);
      }
      this.intermediaryService.dismissLoading();

    }).catch(error => {
      this.intermediaryService.dismissLoading();
      this.audioProvider.playDefaultError();
      this.intermediaryService.presentToastError(error.message);
    })
  }

}
