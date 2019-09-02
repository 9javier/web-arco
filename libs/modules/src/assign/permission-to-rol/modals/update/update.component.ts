import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, LoadingController } from '@ionic/angular';
import { RolesService } from '@suite/services';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  
  rol;
  isLoading = false;

  constructor(private loadingController: LoadingController,private rolService:RolesService,private navParams:NavParams,private modalController:ModalController) {
    this.rol = this.navParams.get("rol");
  }

  ngOnInit() {
  }

  /**
   * Close the current modal
   */
  close():void{
    this.modalController.dismiss();
  }

  /**
   * Update the rol
   */
  submit(modifiedRol):void{
    this.presentLoading();
    this.rolService.putUpdate(modifiedRol).then(observable=>{
      observable.subscribe(data=>{
        this.close();
      }, (err) => {
        console.log(err)
      }, () => {
        this.dismissLoading();
      })
    })
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: 'Un momento ...'
      })
      .then(a => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }
}
