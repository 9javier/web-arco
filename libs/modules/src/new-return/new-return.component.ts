import {Component, OnInit} from '@angular/core';
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import {ActivatedRoute, Router} from "@angular/router";
import LoadResponse = ReturnModel.LoadResponse;
import {BrandModel} from "../../../services/src/models/endpoints/Brand";
import Brand = BrandModel.Brand;
import {WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import OptionsResponse = ReturnModel.OptionsResponse;

@Component({
  selector: 'suite-new-return',
  templateUrl: './new-return.component.html',
  styleUrls: ['./new-return.component.scss']
})
export class NewReturnComponent implements OnInit{

  return: Return;
  types: any[];
  warehouses: Warehouse[];
  providers: any[]; //provider stuff + conditions (email + observations) + brands

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private returnService: ReturnService
  ) {}

  ngOnInit() {
    this.getOptions();
    const returnId: number = parseInt(this.route.snapshot.paramMap.get('id'));
    if(returnId) {
      this.load(returnId);
    }else{
      this.return = {
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
    this.returnService.postSave(this.return).then((response: SaveResponse) => {
      if(response.code == 200){
        this.router.navigateByUrl('/return-tracking-list')
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

  load(returnId: number){
    this.returnService.postLoad(returnId).then((response: LoadResponse) => {
      if (response.code == 200) {
        this.return = response.data;
      } else {
        console.error(response);
      }
    }).catch(console.error);
  }

  getOptions(){
    this.returnService.getOptions().then((response: OptionsResponse) => {
      if(response.code == 200){
        this.types = response.data.types;
        this.warehouses = response.data.warehouses;
        this.providers = response.data.providers;
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

  getStatusName(status: number): string{
    switch(status){
      case 0:
        return '';
      case 1:
        return 'Orden devolución';
      case 2:
        return 'En proceso';
      case 3:
        return 'Preparado';
      case 4:
        return 'Pendiente recogida';
      case 5:
        return 'Recogido';
      case 6:
        return 'Facturado';
      default:
        return 'Desconocido'
    }
  }

  getFormattedDate(value: string): string{
    const date = new Date(value);
    return date.getDay()+'/'+date.getMonth()+'/'+date.getFullYear();
  }

  getBrandNameList(brands: Brand[]): string{
    return brands.map(brand => brand.name).join('/');
  }

}
