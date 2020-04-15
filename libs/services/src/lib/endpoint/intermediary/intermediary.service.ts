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
   * @param position
   * @param durationToast
   */
  async presentToastError(message:string, position: any = "top", durationToast=4000) {
    let toast = (await this.toastCtrl.create({
      message: message,
      duration: durationToast,
      color: 'danger',
      position: position
    })).present();
  }

  /**
   * Show toast
   * @param message - message to be presented
   * @param durationToast - te duration of the visible toast
   */
  async presentToastSuccess(message:string, durationToast=1000, position: any = "top"){
    let toast = (await this.toastCtrl.create({
      message: message,
      duration: durationToast,
      color:'success',
      position: position
    }));

    return toast.present();
  }

  async presentToastPrimary(message:string, durationToast=3750, position: any = "top"){
    let toast = (await this.toastCtrl.create({
      message: message,
      duration: durationToast,
      color:'primary',
      position: position
    }));

    return toast.present();
  }

  async presentToastWarning(message:string, durationToast=3000, position: any = "top"){
    let toast = (await this.toastCtrl.create({
      message: message,
      duration: durationToast,
      color:'warning',
      position: position
    }));

    return toast.present();
  }

  /**
   * launch loading
   * @param message - the message to be showed in loading
   */
  async presentLoading(message:string = "", callback: () => any = ()=>{}){
    if(!this.loading){
      this.loading = true;
      this.loadingCtrl.create({
        message:message
      }).then(loading=>{
        loading.present().then(()=>{
          this.created = true;
          if(callback && typeof callback == 'function'){
            callback();
          }
          if(!this.loading){
            this.dismissLoading();
          }
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
