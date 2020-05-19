import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SupplierConditionModel} from "../../../../services/src/models/endpoints/SupplierCondition";
import SupplierCondition = SupplierConditionModel.SupplierCondition;
import {ProviderModel} from "../../../../services/src/models/endpoints/Provider";
import Provider = ProviderModel.Provider;

@Component({
  selector: 'suite-select-condition',
  templateUrl: './select-condition.component.html',
  styleUrls: ['./select-condition.component.scss'],
})
export class SelectConditionComponent implements OnInit {

  provider: Provider;
  conditions: SupplierCondition[] = [];

  constructor(
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    for(let brand of this.provider.brands){
      if(brand.condition){
        const condition = brand.condition;
        condition.provider = this.provider;
        condition.brand = brand;
        this.conditions.push(condition);
      }
    }
  }

  async close() {
    await this.modalController.dismiss();
  }

  async apply(condition: SupplierCondition) {
    await this.modalController.dismiss(condition);
  }

}
