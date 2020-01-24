import { Component, OnInit, Injectable,Input} from '@angular/core';
import { CarrierService} from '@suite/services';
import { ModalController } from '@ionic/angular';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss']
})
export class HistoryModalComponent implements OnInit {
  public carrierHistoryInfo:CarrierModel.HistoryModal[] = [];

  constructor(
    private carrierService: CarrierService,private modalController:ModalController) { 
    }
    

  ngOnInit() {
  }
  getreference(ref){
    this.carrierService.carrierHistory(ref).subscribe((data)=>{
      this.carrierHistoryInfo  = <any>data;
      console.log(this.carrierHistoryInfo);
    })
  }

  close(){
    this.modalController.dismiss();
  }
}
