import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'suite-utils',
  templateUrl: './utils.component.html',
  styleUrls: ['./utils.component.scss']
})
export class UtilsComponent implements OnInit {

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }
  private isLoading: boolean = false;
  ngOnInit() {
  }



  async presentLoading(msg: string = "Un momento ...") {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: msg
      })
      .then(a => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => { });
          }
        });
      });
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      message: message,
      subHeader: title,
      buttons: ['Ok']
    });
    await alert.present();
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => { });
  }

}
