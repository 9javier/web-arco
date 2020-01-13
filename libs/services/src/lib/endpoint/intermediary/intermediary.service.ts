import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { duration } from 'moment';

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
  async presentToastError(message:string,duration=1000) {
    let toast = (await this.toastCtrl.create({
      message: message,
      duration: duration,
      color: 'danger',
      position: 'top'
    })).present();
  }

  /**
   * Show toast
   * @param message - message to be presented
   * @param duration - te duration of the visible toast
   */
  async presentToastSuccess(message:string,duration=1000){
    let toast = (await this.toastCtrl.create({
      message:message,
      duration:duration,
      color:'success',
      position:'top'
    }))
    return toast.present();
  }

  /**
   * launch loading
   * @param message - the message to be showed in loading
   */
  async presentLoading(message:string = ""){
    if(!this.loading){
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

  }

  /**
   * close the latest modal
   */
  async dismissLoading(){
    this.loading = false;
    if(this.created)
      await this.loadingCtrl.dismiss().then(message=>{
        this.created = false;
        /**flag what indicate that loading has been close */
      });
  }

  async presentConfirm(message:string,callbackOK, callbackCancel?) {
    let buttonsAlert: any = [{
      text: "Cancelar"
    }, {
      text: "Ok",
      handler: callbackOK
    }];

    if (callbackCancel) {
      buttonsAlert[0].handler = callbackCancel;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: message,
      buttons: buttonsAlert
    });
    return await alert.present();
  }

  async presentWarning(message:string, callback) {
    const alert = await this.alertController.create({
      header: '¡Atención!',
      message: message,
      buttons: [{
        text: "Cerrar",
        handler: callback
      }]
    });

    return await alert.present();
  }

  /**
   * Show snackbar
   * @param message - message to be presented
   * @param closeBtn
   */
  async presentSnackbar(message: string, closeBtn: string = 'CERRAR') {
    let toast = await this.toastCtrl.create({
      message: message,
      closeButtonText: closeBtn,
      color: 'dark',
      showCloseButton: true
    });

    return toast.present();
  }
}
