import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ScreenResult} from "../../../receptions-avelon/enums/screen_result.enum";

@Component({
  selector: 'suite-destiny-reception',
  templateUrl: './destiny-reception.component.html',
  styleUrls: ['./destiny-reception.component.scss']
})
export class ModalDestinyReceptionComponent implements OnInit {

  public screenResultType = ScreenResult;
  public typeDestinyReception: number = ScreenResult.WAREHOUSE_LOCATION;

  constructor(
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  public close() {
    this.modalController.dismiss();
  }

  public getDestinyType(): string {
    if (this.typeDestinyReception == this.screenResultType.SORTER_VENTILATION) {
      return 'VENTILACIÓN';
    } else {
      return 'ALMACÉN';
    }
  }
}
