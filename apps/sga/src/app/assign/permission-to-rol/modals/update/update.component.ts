import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { RolesService } from '@suite/services';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  
  rol;

  constructor(private rolService:RolesService,private navParams:NavParams,private modalController:ModalController) {
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
    this.rolService.putUpdate(modifiedRol).then(observable=>{
      observable.subscribe(data=>{
        this.close();
      })
    })
  }
}
