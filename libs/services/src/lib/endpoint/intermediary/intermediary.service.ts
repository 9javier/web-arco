import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class IntermediaryService {

  constructor(private toastCtrl:ToastController) { }

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
  
}
