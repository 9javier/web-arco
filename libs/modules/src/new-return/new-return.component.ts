import {Component, OnInit} from '@angular/core';
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import {ActivatedRoute, Router} from "@angular/router";
import LoadResponse = ReturnModel.LoadResponse;
import {BrandModel} from "../../../services/src/models/endpoints/Brand";
import Brand = BrandModel.Brand;
import {AuthenticationService, WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import OptionsResponse = ReturnModel.OptionsResponse;
import {ReturnTypeModel} from "../../../services/src/models/endpoints/ReturnType";
import ReturnType = ReturnTypeModel.ReturnType;
import {ProviderModel} from "../../../services/src/models/endpoints/Provider";
import Provider = ProviderModel.Provider;

@Component({
  selector: 'suite-new-return',
  templateUrl: './new-return.component.html',
  styleUrls: ['./new-return.component.scss']
})
export class NewReturnComponent implements OnInit{

  return: Return;
  types: ReturnType[];
  warehouses: Warehouse[];
  providers: Provider[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private returnService: ReturnService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.getOptions();
    const returnId: number = parseInt(this.route.snapshot.paramMap.get('id'));
    if (returnId) {
      this.load(returnId);
    } else {
      this.return = {
        amountPackages: 0,
        brands: [],
        dateLastStatus: String(new Date()),
        dateLimit: "",
        datePickup: "",
        datePredictedPickup: "",
        dateReturnBefore: "",
        email: "",
        history: false,
        id: 0,
        lastStatus: 1,
        observations: "",
        packings: [],
        printTagPackages: false,
        provider: null,
        shipper: "",
        status: 1,
        type: null,
        unitsPrepared: 0,
        unitsSelected: 0,
        user: await this.authenticationService.getCurrentUser(),
        userLastStatus: await this.authenticationService.getCurrentUser(),
        warehouse: null
      };
    }
  }

  save(){
    this.returnService.postSave({return: this.return}).then((response: SaveResponse) => {
      if(response.code == 200){
        this.router.navigateByUrl('/return-tracking-list')
      }else{
        console.error(response);
      }
    }).catch(console.error);
  }

  load(returnId: number){
    this.returnService.postLoad({returnId: returnId}).then((response: LoadResponse) => {
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

  getBrandNameList(brands: Brand[]): string{
    return brands.map(brand => brand.name).join('/');
  }

  getProviderBrands(): Brand[]{
    return this.providers.filter(provider => provider.id == this.return.provider.id)[0].brands;
  }

  selectBrands(event){
    const selectedIds: number[] = event.detail.value.map(brandId => {return parseInt(brandId)});
    this.return.brands = this.providers.filter(provider => provider.id == this.return.provider.id)[0].brands.filter(brand => selectedIds.includes(brand.id));
  }

  getSelectedBrandIds(){
    return this.return.brands.map(brand => {return brand.id.toString()});
  }

  async changeStatus(status: number) {
    this.return.status = status;
    this.return.lastStatus = status;
    this.return.userLastStatus = await this.authenticationService.getCurrentUser();
    this.return.dateLastStatus = String(new Date());
  }

}
