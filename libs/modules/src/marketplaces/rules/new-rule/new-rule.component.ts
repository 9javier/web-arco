import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-new-rule',
  templateUrl: './new-rule.component.html',
  styleUrls: ['./new-rule.component.scss']
})
export class NewRuleComponent implements OnInit {
  
  categories_data = [
    {id: 31, name: 'Mujer'},
    {id: 33, name: 'Hombre'}
  ];

  displayedColumns: string[] = ['check', 'id', 'name'];
  dataSource = this.categories_data;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  close(){
    this.modalController.dismiss();
  }

  createRule() {
    console.log('create rule')
  }

}
