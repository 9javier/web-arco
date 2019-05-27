import {Component, Input, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {StoreComponent} from "../../workwaves/store/store.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'list-workwave-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwaveTemplateComponent implements OnInit {

  @Input() templateToEdit: any;
  listStoresTemplates: any[];
  template: any;

  constructor(
    private location: Location,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.listStoresTemplates = [
      {
        id: 1,
        name: '001 KRACK Vigo Gran Vía',
        checked: false,
        consolidated: 0,
        shipping: 0,
        replace: '',
        allocate: '',
        selection: '',
        packing: ''
      },
      {
        id: 2,
        name: '002 KRACK Pontevedra',
        checked: false,
        consolidated: 0,
        shipping: 0,
        replace: '',
        allocate: '',
        selection: '',
        packing: ''
      },
      {
        id: 3,
        name: '003 KRACK Coruña',
        checked: false,
        consolidated: 0,
        shipping: 0,
        replace: '',
        allocate: '',
        selection: '',
        packing: ''
      },
      {
        id: 4,
        name: '004 KRACK Santiago As Cancelas',
        checked: false,
        consolidated: 0,
        shipping: 0,
        replace: '',
        allocate: '',
        selection: '',
        packing: ''
      },
      {
        id: 5,
        name: '005 KRACK Lugo',
        checked: false,
        consolidated: 0,
        shipping: 0,
        replace: '',
        allocate: '',
        selection: '',
        packing: ''
      }
    ];

    if (this.templateToEdit) {
      this.template = this.templateToEdit;
    } else {
      this.template = {
        name: 'Nueva Plantilla',
        new: true
      };
    }
  }

  async saveTemplate() {
  }

  goPreviousPage () {
    this.location.back();
  }

  changeStoreTemplate(data) {
    console.debug('Test::ChangeStoreTemplate -> ', data);
    if (data.field == 'replace' && data.store.replace == '1' && data.store.allocate == '1') {
      data.store.allocate = '2';
    }
    if (data.field == 'allocate' && data.store.allocate == '1' && data.store.replace == '1') {
      data.store.replace = '2';
    }
  }

}
