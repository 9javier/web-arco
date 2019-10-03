import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { SorterService } from '../../../../../services/src/lib/endpoint/sorter/sorter.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  wareHouses: any;
  sorterId: any;
  colors: any;
  sorter: any;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams,
    private sorteService: SorterService,
  ) {
    this.wareHouses = this.navParams.get("wareHouses");
    this.sorterId = this.navParams.get("sorterId");
    this.colors = this.navParams.get("colors");
  }

  ngOnInit() {
    this.sorteService.getShow(this.sorterId).subscribe(data => {
      this.sorter = data.data;
    }, err => {
      console.log(err)
    })
  }

  close():void{
    this.modalController.dismiss();
  }

  submit():void{
    let { ...data} = this.base.getValue();
    let ways = 0;
    const payload = {
      active: false, ways, ...data
    }
    this.sorteService
      .updateSorter(payload, payload.id).subscribe((data) => {
        console.log(data);
        this.close();
      });
  }

}
