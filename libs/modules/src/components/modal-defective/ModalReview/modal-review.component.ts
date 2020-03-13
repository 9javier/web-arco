import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'suite-modal-review',
  templateUrl: './modal-review.component.html',
  styleUrls: ['./modal-review.component.scss']
})
export class ModalReviewComponent implements OnInit {
  imgSrc
  constructor(private modalController: ModalController,
    public navParams: NavParams) {
      const data = this.navParams.get('data');
      this.imgSrc = data.pathMedium;
     }

  ngOnInit() {
    
  }
  dismiss() {
    this.modalController.dismiss()
  }
}
