import {Component, OnInit} from '@angular/core';
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import {ActivatedRoute, Router} from "@angular/router";
import LoadResponse = ReturnModel.LoadResponse;

@Component({
  selector: 'suite-new-return',
  templateUrl: './new-return.component.html',
  styleUrls: ['./new-return.component.scss']
})
export class NewReturnComponent implements OnInit{

  newReturn: Return;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private returnService: ReturnService
  ) {}

  ngOnInit() {
    const returnId: number = parseInt(this.route.snapshot.paramMap.get('id'));
    if(returnId) {
      this.returnService.postLoad(returnId).then((response: LoadResponse) => {
        if (response.code == 200) {
          this.newReturn = response.data;
        } else {
          console.error(response);
        }
      }).catch(console.error);
    }else{
      this.newReturn = {
        amountPackages: 0,
        brands: [],
        dateLastStatus: "",
        dateLimit: "",
        datePickup: "",
        datePredictedPickup: "",
        dateReturnBefore: "",
        email: "",
        history: false,
        id: 0,
        lastStatus: 0,
        observations: "",
        packings: [],
        printTagPackages: false,
        provider: undefined,
        shipper: "",
        status: 0,
        type: undefined,
        unitsPrepared: 0,
        unitsSelected: 0,
        user: undefined,
        userLastStatus: undefined,
        warehouse: undefined
      };
    }
  }

  save(){
    this.returnService.postSave(this.newReturn).then((response: SaveResponse) => {
      if(response.code == 200){
        this.router.navigateByUrl('/return-tracking-list')
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

}
