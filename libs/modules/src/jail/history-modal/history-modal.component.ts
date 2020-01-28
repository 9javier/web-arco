import { NavParams, ModalController } from '@ionic/angular';
import { Component, OnInit, Injectable, Input, Inject } from '@angular/core';
import { CarrierService, TypesService } from '@suite/services';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss']
})
export class HistoryModalComponent implements OnInit {
  reference
  packingReference
  actionTypes = {};
  dates: any[] = [];
  hours: any[] = [];
  constructor(
    private carrierService: CarrierService,
    private modalController: ModalController,
    private typeService: TypesService,
  ) {}

  carrierHistory: [];

  ngOnInit() {
    console.log(this.packingReference)
    this.getReference(this.packingReference)
    this.getActionTypes()
  }
  getReference(ref) {
    
    this.carrierService.carrierHistory(ref).subscribe((response) => {
      this.reference = response
      console.log(this.reference);
      for (let i = 0; i < this.reference.length; i++) {
        this.dates[i] = moment(ref[i].updatedAt).format('DD/MM/YYYY');
        this.hours[i] = moment(ref[i].updatedAt).format('HH:mm:ss');
      }
            
    });
  }
  close() {
    this.modalController.dismiss()
  }
  getActionTypes(): void {
    this.typeService.getTypeActions().subscribe(ActionTypes => {
      /**fill the actionTypes dictionary */
      ActionTypes.forEach(actionType => {
        this.actionTypes[actionType.id] = actionType.name
      })
    })
  }
}
