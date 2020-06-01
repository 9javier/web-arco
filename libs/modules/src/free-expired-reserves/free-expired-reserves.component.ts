import {Component, OnInit, ViewChild} from '@angular/core';
import {DeliveryRequestModel} from "../../../services/src/models/endpoints/DeliveryRequest";
import DeliveryRequest = DeliveryRequestModel.DeliveryRequest;
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import ExpiredReservesResponse = DeliveryRequestModel.ExpiredReservesResponse;
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";
import {MatPaginator} from "@angular/material";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Pagination = ReturnModel.Pagination;

@Component({
  selector: 'suite-free-expired-reserves',
  templateUrl: './free-expired-reserves.component.html',
  styleUrls: ['./free-expired-reserves.component.scss'],
})
export class FreeExpiredReservesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  selected: boolean = true;
  reserves: DeliveryRequest[] = [];
  pagination: Pagination = {
    limit: 10,
    page: 1
  };

  constructor(
    private pickingStoreService: PickingStoreService,
    private dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {
    this.paginator.pageSizeOptions = [10, 30, 100];
    this.paginator.pageSize = 10;
    this.load();
    this.paginator.page.subscribe(async paginator => {
      this.pagination.limit = paginator.pageSize;
      this.pagination.page = paginator.pageIndex + 1;
      this.load();
    });
  }

  load(){
    this.pickingStoreService.getExpiredReserves({pagination: this.pagination}).then((response: ExpiredReservesResponse) => {
      if(response.code == 200){
        this.reserves = response.data[0];
        this.paginator.length = response.data[1];
        for(let reserve of this.reserves){
          reserve.selected = true;
        }
      }else{
        console.error(response);
      }
    }).catch(console.error)
  }

  refresh(){
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.load();
  }

  checkboxChange(){
    let anySelected: boolean = false;
    for(let reserve of this.reserves){
      if(reserve.selected){
        anySelected = true;
        break;
      }
    }
    this.selected = this.reserves.length > 0 && anySelected;
  }

  free(){}

}
