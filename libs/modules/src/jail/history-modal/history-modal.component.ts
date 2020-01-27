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
  constructor(
    private carrierService: CarrierService,private modalController:ModalController) { 
    }
    
    carrierHistory:[];

  ngOnInit() {
  }
  getreference(ref){
 this.carrierService.carrierHistory(ref).subscribe(response => {
 return response.data
})
  }
  }



