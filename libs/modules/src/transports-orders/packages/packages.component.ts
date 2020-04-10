import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  packages:Array<any>
  constructor(
    private modalController: ModalController
  ) { }
  displayedColumns: string[] = [
    'id',
    'container',
    'tracking',
    'nota'
  ];
  ngOnInit() {
    // console.log(this.packages);
    
  }
  dismiss() {
    this.modalController.dismiss()
  }
}
