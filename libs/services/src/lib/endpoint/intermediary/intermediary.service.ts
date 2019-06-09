import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class IntermediaryService {

  loading;
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
    if(this.loading)
      await this.loadingCtrl.dismiss();
    this.loading = (await this.loadingCtrl.create({
      message:message
    }));
    this.loading.present();
  }

  /**
   * close the latest modal
   */
  async dismissLoading(){
    this.loadingCtrl.dismiss().then(message=>{
      console.log("dismissed")
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
