import {Component, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'suite-modal-model-images',
  templateUrl: './modal-model-images.component.html',
  styleUrls: ['./modal-model-images.component.scss']
})
export class ModalModelImagesComponent implements OnInit {

  public image: string;

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {

  }

  public close() {
    this.popoverController.dismiss();
  }
}
