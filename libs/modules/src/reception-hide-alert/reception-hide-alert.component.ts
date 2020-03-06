import { Component, OnInit } from '@angular/core';
import {WarehouseReceptionAlertService} from "../../../services/src/lib/endpoint/warehouse-reception-alert/warehouse-reception-alert.service";
import {IntermediaryService} from "@suite/services";

@Component({
  selector: 'app-reception-hide-alert',
  templateUrl: './reception-hide-alert.component.html',
  styleUrls: ['./reception-hide-alert.component.scss']
})
export class ReceptionHideAlertComponent implements OnInit {

  warehouses: {
    reference: string,
    name: string,
    allowed: boolean
  }[];

  constructor(
    private warehouseReceptionAlertService: WarehouseReceptionAlertService,
    private intermediaryService: IntermediaryService
  ) {}

  async ngOnInit() {
    this.warehouses = (await this.warehouseReceptionAlertService.getAll()).data;
    if(!this.warehouses || this.warehouses.length == 0){
      await this.intermediaryService.presentToastError("No se han podido cargar los datos de las tiendas.", 'BOTTOM');
    }
  }

  save(){
    this.warehouseReceptionAlertService.saveAll(this.warehouses).then(async response => {
      if (response.code == 200) {
        await this.intermediaryService.presentToastSuccess('Los cambios se han guardado correctamente.', 2000, 'BOTTOM');
      } else {
        console.error(response);
        await this.intermediaryService.presentToastError("Ha ocurrido un error al guardar los datos.", 'BOTTOM');
      }
    }, async error => {
      console.error(error);
      await this.intermediaryService.presentToastError("Ha ocurrido un error al guardar los datos.", 'BOTTOM');
    });
  }

}
