import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NewRuleComponent } from './new-rule/new-rule.component';

@Component({
  selector: 'suite-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  categories_data = [
    {
      name: 'Mujer', 
      categories: 'Mujer, mujer outlet, mujer rebajas, todo mujer', 
      product_quantity: '3655 productos'}
  ];

  displayedCategoriesColumns: string[] = ['name', 'categories', 'product_quantity', 'edit'];
  dataSourceCategories = this.categories_data;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController
  ) { 
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
  }

  async openModalNewRule(): Promise<void> {
    let modal = (await this.modalController.create({
      component: NewRuleComponent
    }));
    modal.onDidDismiss().then((response) => {
     console.log(response)
    });
    modal.present();
  }

}
