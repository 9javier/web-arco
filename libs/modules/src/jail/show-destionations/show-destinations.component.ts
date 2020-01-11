import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-show-destinations',
  templateUrl: './show-destinations.component.html',
  styleUrls: ['./show-destinations.component.scss']
})
export class ShowDestinationsComponent implements OnInit {
  title = 'Destinos';
  redirectTo = '/jails';
  destinations;
  jail;
  constructor(
    private modalController:ModalController,
    private navParams:NavParams,
  ) {}

  ngOnInit() {
    this.jail = this.navParams.get("jail");
    this.destinations = this.jail.carrierWarehousesDestiny; // warehouse
  }

  submit(){
    this.modalController.dismiss();
  }

  close():void{
    this.modalController.dismiss();
  }
}
