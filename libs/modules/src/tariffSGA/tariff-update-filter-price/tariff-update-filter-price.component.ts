import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { WarehouseService, TariffService } from '@suite/services';
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-tariff-update-filter-price',
  templateUrl: './tariff-update-filter-price.component.html',
  styleUrls: ['./tariff-update-filter-price.component.scss']
})
export class TariffUpdateFilterPriceComponent implements OnInit {
  title = 'Actualizar Filtro Precio';
  redirectTo = '/tariff';
  destinations;
  tariff;
  datas;
  warehousesResult;
  optionsStatus = [];
  constructor(
    private modalController:ModalController,
    private navParams:NavParams,
    private intermediaryService:IntermediaryService,
    private warehouseService:WarehouseService,
    private tariffService: TariffService
  ) {}

  ngOnInit() {
    this.tariff = this.navParams.get("tariff");
    this.optionsStatus = [1,2,3,4,5,6,7];
    this.loadWarehouse();
  }

  loadWarehouse() {
    let that = this;
     this.tariffService.getFilterPriceTypes().subscribe(result => {
      this.optionsStatus = result['data'];
      this.warehouseService.getAllByTariff(this.tariff.id).subscribe(result => {
        if(result['code'] == 200) { // success
          that.warehousesResult = result['data'];
          that.warehousesResult = that.warehousesResult.map(elem => {
            elem['optionSelected'] = 0;
            elem['optionsStatus'] = that.optionsStatus;
            elem['isAvailableFilterPrice'] = false;
            return elem;
          });
        }
      });
    });
  }

  submit(){
    this.intermediaryService.presentLoading();
    let data = this.warehousesResult.filter(res => {
      return res.optionSelected > 0 ;
    });
    data = data.map(res => {
      let response = {};
      response['tariffId'] = res.tariff.id;
      response['warehouseId'] = res.warehouse.id;
      response['status'] = res.optionSelected;
      return response;
    });
    this.tariffService.updateFilterPrice(data).subscribe(()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastSuccess("Estado de filtro de precio actualizada con éxito");
      this.close();
    },()=>{
      this.intermediaryService.dismissLoading();
      this.intermediaryService.presentToastError("Error actualizando estado de filtro de precio");
    })
  }

  close():void{
    this.modalController.dismiss();
  }
  changeTexbox(event, res){
    event.stopPropagation();
    event.preventDefault();
    res.isAvailableFilterPrice = event.target.value > 0;
  }
}
