import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class IntermediaryService {

  loading;
  created;
  constructor(private toastCtrl:ToastController, private loadingCtrl:LoadingController, private alertController:AlertController) { }

  /**
   * Show error message
   * @param message - message to be toasted
   */
  async presentToastError(message:string) {
    let toast = (await this.toastCtrl.create({
      message: message,
      duration: 1000,
      color: 'danger',
      position: 'top'
    })).present();
  }

  /**
   * launch loading
   * @param message - the message to be showed in loading
   */
  async presentLoading(message:string = ""){
    this.loading = true;
    this.loadingCtrl.create({
      message:message
    }).then(loading=>{
      loading.present().then(()=>{
        this.created = true;
        if(!this.loading)
          this.dismissLoading();
      });
    })
  }

  /**
   * close the latest modal
   */
  async dismissLoading(){
    /**flag what indicate that loading has been close */
    this.loading = false;
    if(this.created)
      await this.loadingCtrl.dismiss().then(message=>{
        this.created = false;
      });
  }

  async presentConfirm(message:string,callbak) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: message,
      buttons: [{
        text:"Ok",
        handler:callbak
      },{
        text:"Cancelar"
      }]
    });
    return await alert.present();
  }
  
}
