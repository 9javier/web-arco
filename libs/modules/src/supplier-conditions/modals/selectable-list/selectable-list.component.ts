import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-data',
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.scss']
})
export class SelectableListComponent implements OnInit {

  @Input() listItemsSelected: any[] = [];
  @Input() itemForList: string = '';

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {

  }

  closeList(data) {
    this.modalController.dismiss(data);
  }
}
