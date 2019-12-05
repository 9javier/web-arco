import { ReceptionsAvelonService, ReceptionAvelonModel } from '@suite/services';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { VirtualKeyboardComponent } from '../components/virtual-keyboard/virtual-keyboard.component';

@Component({
  selector: 'suite-receptions-avelon',
  templateUrl: './receptions-avelon.component.html',
  styleUrls: ['./receptions-avelon.component.scss']
})
export class ReceptionsAvelonComponent implements OnInit {
  response: ReceptionAvelonModel.Reception;
  eventEmitter= new EventEmitter();
  constructor(private reception: ReceptionsAvelonService, private popoverController: PopoverController) { }

  ngOnInit() {
    this.response = {
      brands: [],
      models: [],
      sizes:  [],
      colors: [],
      ean:    ''
    }
    this.reception.getReceptions().subscribe((data: ReceptionAvelonModel.Reception)  => {
      console.log(data);
      this.response = data;
    })

    this.eventEmitter.subscribe(res=>{
      console.log("eventOnKeyPress", res)
    });
  }

  async openVirtualKeyboard(list: any[]) {
    const dataList = [];

    list.forEach((item) => {
      dataList.push({id: item.id, value: item.name})
    });

    const popover = await this.popoverController.create({
      component: VirtualKeyboardComponent,
      translucent: true,
      componentProps: { data: dataList, eventOnKeyPress: this.eventEmitter },
      cssClass: 'virtual-keyboard-component'
    });

    popover.onDidDismiss().then((selected: any) => {
      console.log('Selected Item');
      console.log(selected);
    });

    return await popover.present();
  }
}
