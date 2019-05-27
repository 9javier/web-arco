import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {ModalController} from "@ionic/angular";
import {StoreComponent} from "../store/store.component";

@Component({
  selector: 'list-workwaves',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesComponent implements OnInit {

  public listWorkwaves: any[] = [];

  constructor(
    private modalController: ModalController
  ) {}

  ngOnInit() {

  }

  async createWorkwave() {
    const modalCreate = await this.modalController.create({
      component: StoreComponent
    });

    return await modalCreate.present();
  }

}
