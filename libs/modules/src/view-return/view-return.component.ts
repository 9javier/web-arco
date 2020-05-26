import {Component, OnInit} from '@angular/core';
import {ReturnService} from "../../../services/src/lib/endpoint/return/return.service";
import {ReturnModel} from "../../../services/src/models/endpoints/Return";
import Return = ReturnModel.Return;
import SaveResponse = ReturnModel.SaveResponse;
import {ActivatedRoute, Router} from "@angular/router";
import LoadResponse = ReturnModel.LoadResponse;
import {BrandModel} from "../../../services/src/models/endpoints/Brand";
import Brand = BrandModel.Brand;
import {AuthenticationService} from "@suite/services";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {PickingProvider} from "../../../services/src/providers/picking/picking.provider";
import ReturnPacking = ReturnModel.ReturnPacking;
import {Events} from "@ionic/angular";

@Component({
  selector: 'suite-view-return',
  templateUrl: './view-return.component.html',
  styleUrls: ['./view-return.component.scss']
})
export class ViewReturnComponent implements OnInit {

  return: Return;

  constructor(
    private events: Events,
    private route: ActivatedRoute,
    public router: Router,
    private pickingProvider: PickingProvider,
    private returnService: ReturnService,
    private toolbarProvider: ToolbarProvider,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.toolbarProvider.currentPage.next('Picking Devolución');
    this.toolbarProvider.optionsActions.next([]);
    this.load(parseInt(this.route.snapshot.paramMap.get('id')));

    this.events.subscribe('picking:remove', () => {
      this.load(parseInt(this.route.snapshot.paramMap.get('id')));
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('picking:remove');
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
        this.pickingProvider.currentReturnPickingId = this.return.id;
      } else {
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
        return 'Pendiente';
      case 3:
        return 'En proceso';
      case 4:
        return 'Preparado';
      case 5:
        return 'Pendiente recogida';
      case 6:
        return 'Recogido';
      case 7:
        return 'Facturado';
      default:
        return 'Desconocido'
    }
  }

  getBrandNameList(brands: Brand[]): string{
    return brands.map(brand => brand.name).join('/');
  }

  getPackingNameList(returnPackings: ReturnPacking[]): string{
    return returnPackings.map(returnPacking => returnPacking.packing.reference).join('/');
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

}
