import { NavParams, ModalController } from '@ionic/angular';
import { Component, OnInit, Injectable, Input, Inject } from '@angular/core';
import { CarrierService, TypesService } from '@suite/services';
import { CarrierModel } from 'libs/services/src/models/endpoints/carrier.model';
import * as moment from 'moment';
import {DateTimeParserService} from "../../../../services/src/lib/date-time-parser/date-time-parser.service";
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
  constructor(
    private carrierService: CarrierService,
    private modalController: ModalController,
    private typeService: TypesService,
    private dateTimeParserService: DateTimeParserService
  ) {}

  carrierHistory: [];

  ngOnInit() {
    this.getReference(this.packingReference)
    this.getPackingMovementsTypes();
  }
  getReference(ref) {

    this.carrierService.carrierHistory(ref).subscribe((response) => {
      this.reference = response
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

  getFormatDate(date){
    if(date){
      return this.dateTimeParserService.dateTime(date)
    } else {
      return "-";
    }

  }
}
