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
  movementTypes = {};
  dates: any[] = [];
  hours: any[] = [];
  constructor(
    private carrierService: CarrierService,
    private modalController: ModalController,
    private typeService: TypesService,
  ) {}

  carrierHistory: [];

  ngOnInit() {
    this.getReference(this.packingReference)
    this.getPackingMovementsTypes()
  }
  getReference(ref) {
    
    this.carrierService.carrierHistory(ref).subscribe((response) => {
      this.reference = response
      for (let i = 0; i < this.reference.length; i++) {
        this.dates[i] = moment(ref[i].updatedAt).format('DD/MM/YYYY');
        this.hours[i] = moment(ref[i].updatedAt).format('HH:mm:ss');
      }
            
    });
  }
  close() {
    this.modalController.dismiss()
  }
  getPackingMovementsTypes(): void {
    this.typeService.getPackingMovementsTypesActions().subscribe(MovementTypes => {
      /**fill the actionTypes dictionary */
      MovementTypes.forEach(movementType => {
        this.movementTypes[movementType.id] = movementType.name
      })
    })
  }
}
