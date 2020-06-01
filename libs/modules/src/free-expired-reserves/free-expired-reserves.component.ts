import { Component, OnInit } from '@angular/core';
import {DeliveryRequestModel} from "../../../services/src/models/endpoints/DeliveryRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import ExpiredReservesResponse = DeliveryRequestModel.ExpiredReservesResponse;
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'suite-free-expired-reserves',
  templateUrl: './free-expired-reserves.component.html',
  styleUrls: ['./free-expired-reserves.component.scss'],
})
export class FreeExpiredReservesComponent implements OnInit {

  selected: boolean = true;
  reserves: DeliveryRequest[] = [];

  constructor(
    private pickingStoreService: PickingStoreService,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {
    this.load();
  }

  load(){
    this.pickingStoreService.getExpiredReserves().then((response: ExpiredReservesResponse) => {
      if(response.code == 200){
        this.reserves = response.data;
      }else{
        console.error(response);
      }
    }).catch(console.error)
  }

  free(){}

}
