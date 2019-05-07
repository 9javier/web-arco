import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import {ModalController, NavParams} from "@ionic/angular";

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class UpdateComponent implements OnInit {
  formBuilderDataInputs = {
    rows: ['', Validators.required],
    columns: ['', Validators.required]
  };
  formBuilderTemplateInputs = [
    {
      name: 'rows',
      label: 'Número de Filas',
      type: 'select',
      value: [1, 2, 3, 4, 5],
      icon: {type: 'md', name: 'view_stream'}
    },
    {
      name: 'columns',
      label: 'Número de Columnas',
      type: 'select',
      value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      icon: {type: 'md', name: 'view_column'}
    }
  ];
  title = 'Ubicación ';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/locations';
  updateForm: FormGroup;

  listProducts: any[] = [
    {
      reference: '00126456',
      name: 'MARCA Modelo Modelo'
    },
    {
      reference: '00124540',
      name: 'MARCA Modelo Modelo'
    },
    {
      reference: '00122626',
      name: 'MARCA Modelo Modelo'
    },
    {
      reference: '00127457',
      name: 'MARCA Modelo Modelo'
    },
    {
      reference: '00121123',
      name: 'MARCA Modelo Modelo'
    }
    ];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    ) {}

  ngOnInit() {
    let container = this.navParams.data.container;
    this.title += container.column + ' . ' + container.row;
    this.updateForm = this.formBuilder.group(
      this.formBuilderDataInputs,
      {}
    );
  }

  goToList() {
    this.modalController.dismiss();
  }

  get f() {
    return this.updateForm.controls;
  }

  scanProduct() {

  }

}
