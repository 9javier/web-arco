import { Component, OnInit, Input } from '@angular/core';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-send-jail',
  templateUrl: './send-jail.component.html',
  styleUrls: ['./send-jail.component.scss']
})
export class SendJailComponent implements OnInit {

  @Input() jails:CarrierModel.Carrier[];
  

  constructor(private modalController:ModalController) { }

  ngOnInit() {
    console.log(this.jails);
    
  }

  close(){
    this.modalController.dismiss();
  }

}
