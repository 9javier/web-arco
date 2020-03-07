import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
@Component({
  selector: 'suite-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.scss']
})
export class ShowImageComponent implements OnInit {
  reference;
  urlImage;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
  ) {
    this.reference = this.navParams.get("reference");
    this.urlImage = this.navParams.get("urlImage");
  }

  async close() {
    await this.modalController.dismiss();
  }

  ngOnInit() {

  }
}
