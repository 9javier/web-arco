import {Component, Input, OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-review-images',
  templateUrl: './review-images.component.html',
  styleUrls: ['./review-images.component.scss']
})
export class ReviewImagesComponent implements OnInit {

  @Input("imgSrc") imgSrc;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss()
  }
}
