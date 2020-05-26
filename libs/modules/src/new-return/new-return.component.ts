import {Component, OnInit} from '@angular/core';
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import {ActivatedRoute, Router} from "@angular/router";
import LoadResponse = ReturnModel.LoadResponse;
import {BrandModel} from "../../../services/src/models/endpoints/Brand";
import Brand = BrandModel.Brand;
import {AuthenticationService, UserModel, WarehouseModel} from "@suite/services";
import Warehouse = WarehouseModel.Warehouse;
import OptionsResponse = ReturnModel.OptionsResponse;
import {ReturnTypeModel} from "../../../services/src/models/endpoints/ReturnType";
import ReturnType = ReturnTypeModel.ReturnType;
import {ProviderModel} from "../../../services/src/models/endpoints/Provider";
import Provider = ProviderModel.Provider;
import User = UserModel.User;
import {ModalController} from "@ionic/angular";
import {SelectConditionComponent} from "./select-condition/select-condition.component";
import {SupplierConditionModel} from "../../../services/src/models/endpoints/SupplierCondition";
import SupplierCondition = SupplierConditionModel.SupplierCondition;
import {SelectableListComponent} from "./modals/selectable-list/selectable-list.component";

@Component({
  selector: 'suite-new-return',
  templateUrl: './new-return.component.html',
  styleUrls: ['./new-return.component.scss']
})
export class NewReturnComponent implements OnInit {

  return: Return;
  types: ReturnType[];
  warehouses: Warehouse[];
  providers: Provider[];

  private listItemsSelected: any[] = [];
  private itemForList: string = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private returnService: ReturnService,
    private authenticationService: AuthenticationService,
    private modalController: ModalController
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
        user: await this.getCurrentUser(),
        userLastStatus: await this.getCurrentUser(),
        warehouse: null
      };
    }
  }

  async getCurrentUser() {
    const user: User = await this.authenticationService.getCurrentUser();
    delete user.permits;
    return user;
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
        this.return.provider.brands = this.providers.filter(provider => provider.id == this.return.provider.id)[0].brands;
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

  async changeStatus(status: number) {
    this.return.status = status;
    this.return.lastStatus = status;
    this.return.userLastStatus = await this.authenticationService.getCurrentUser();
    this.return.dateLastStatus = String(new Date());
  }

  allFieldsFilled(): boolean{
    return !!(this.return && this.return.type && this.return.warehouse && this.return.provider && this.return.brands && this.return.dateReturnBefore);
  }

  thereAreConditions(): boolean{
    if(this.return.provider){
      return this.return.provider.brands.map(brand => {if(brand.condition) return brand.condition}).length > 0;
    }else{
      return false;
    }
  }

  async selectCondition() {
    const modal = await this.modalController.create({
      component: SelectConditionComponent,
      componentProps: {
        provider: this.return.provider
      }
    });

    modal.onDidDismiss().then(response => {
      if (response.data) {
        const condition: SupplierCondition = response.data;
        this.return.email = condition.contact;
        this.return.observations = condition.observations;
      }
    });

    await modal.present();
  }

  public async openShowSelectableList(type: number) {
    switch (type) {
      case 1:
        this.listItemsSelected = this.types.map(v => {
          return {id: v.id, value: v.name}
        });
        this.itemForList = 'Tipo';
        break;
      case 2:
        this.listItemsSelected = this.warehouses.map(v => {
          return {id: v.id, value: `${v.reference} - ${v.name}`}
        });
        this.itemForList = 'Almacén';
        break;
      case 3:
        this.listItemsSelected = this.providers.map(v => {
          return {id: v.id, value: v.name}
        });
        this.itemForList = 'Proveedor';
        break;
    }

    const modal = await this.modalController.create({
      component: SelectableListComponent,
      componentProps: { listItemsSelected: this.listItemsSelected, itemForList: this.itemForList }
    });
    modal.onDidDismiss().then(result => {
      if (result && result.data != null) {
        switch (type) {
          case 1:
            this.return.type = this.types.find(v => v.id == result.data);
            break;
          case 2:
            this.return.warehouse = this.warehouses.find(v => v.id == result.data);
            break;
          case 3:
            this.return.provider = this.providers.find(v => v.id == result.data);
            break;
        }
      }
    });
    await modal.present();
  }

  public selectUnitiesItems() {
    let isDefective = false;
    if (this.return.type && this.return.type.defective) {
      isDefective = true;
    }

    const warehouseId = this.return.warehouse.id;
    const providerId = this.return.provider && this.return.provider.id;
    const brandIds = this.return.brands.map(b => b.id).join(',');

    this.router.navigate(['new-return', 'unities', this.return.id], { queryParams: {defective: isDefective, warehouse: warehouseId, provider: providerId, brands: brandIds} });
  }
}
