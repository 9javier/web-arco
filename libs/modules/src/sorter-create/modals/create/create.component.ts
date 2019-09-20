import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { BaseComponent } from '../base/base.component';
import { SorterService } from 'libs/services/src/lib/endpoint/sorter/sorter.service';

@Component({
  selector: 'suite-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  wareHouses: any;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams,
    private sorteService: SorterService,
  ) {
    this.wareHouses = this.navParams.get("wareHouses");
    console.log(this.wareHouses);
  }

  ngOnInit() {
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    let { colors, ...data} = this.base.getValue();
    colors = [1];
    const payload = {
      colors, ...data
    }
    this.sorteService
      .postCreate(payload).subscribe((data) => {
        console.log(data.data);
        this.close();
      });
  }
}
