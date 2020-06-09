import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { environment } from '@suite/services';

@Component({
  selector: 'suite-modal-review',
  templateUrl: './modal-review.component.html',
  styleUrls: ['./modal-review.component.scss']
})
export class ModalReviewComponent implements OnInit {
  baseUrlPhoto = environment.apiBasePhoto;
  imgSrc;
  img;
  constructor(private modalController: ModalController,
    public navParams: NavParams) {
      const data = this.navParams.get('data');
      this.imgSrc = data.pathOriginal;
     }

  ngOnInit() {
    setTimeout(() => this.img = this.imgSrc, 500);
  }
  dismiss() {
    this.modalController.dismiss()
  }
}
