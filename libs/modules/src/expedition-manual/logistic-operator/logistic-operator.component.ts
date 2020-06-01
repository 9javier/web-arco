import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, Sort } from '@angular/material';
import * as Filesave from 'file-saver';
import * as _ from 'lodash';
import { parse } from 'querystring';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Platform, ModalController, NavParams } from '@ionic/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import { ExpeditionManualService } from '../../../../services/src/lib/endpoint/expedition-manual/expedition-manual.service';
import { FormsModule } from '@angular/forms';
import { IntermediaryService } from '../../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'suite-logistic-operator',
  templateUrl: './logistic-operator.component.html',
  styleUrls: ['./logistic-operator.component.scss']
})

export class LogisticOperatorComponent implements OnInit {
  id;
  data = {
    operator: {
      id: "",
      name: ""
    },
    name: "",
    lastname: "",
    dni: "",
    phone: "",
    direction: "",
    province: "",
    country: "",
    postalcode: "",
    packages: "",
    incidence: true
  };

  form: FormGroup;
  operators;
  selected;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private expeManSrv: ExpeditionManualService,
    private intermediaryServiceL: IntermediaryService,
    private navParams: NavParams
  ) {
  }
  ngOnInit() {
    this.id = this.navParams.get('id');
    this.getIncidence(this.id);
    this.getTransports();
    this.form = this.formBuilder.group({
      expeditionId: this.id,
      operator: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      dni: ['', Validators.required],
      phone: ['', Validators.required],
      direction: ['', Validators.required],
      province: ['', Validators.required],
      country: ['', Validators.required],
      postalcode: ['', Validators.required],
      packages: ['', Validators.required],
      incidence: true
    });
    this.clean();
  }

  getIncidence(id) {
    this.expeManSrv.getExpedition(id).subscribe(data => {
      this.form.get('operator').setValue(data.transport.transport.id);
      this.form.get('name').setValue(data.transport.shippingCompanyName);
      this.form.get('lastname').setValue(data.transport.shippingCompanyName)
      this.form.get('dni').setValue(data.transport.shippingCompanyName)
      this.form.get('phone').setValue(data.transport.shippingPhone)
      this.form.get('direction').setValue(data.transport.invoiceAddressee1)
      this.form.get('province').setValue(data.transport.invoiceProvince)
      this.form.get('country').setValue(data.transport.invoiceCountry)
      this.form.get('postalcode').setValue(data.transport.invoiceZipCode)
      this.form.get('packages').setValue(data.countPackage)
    });
  }

  getTransports() {

    this.expeManSrv.getTrasnport().subscribe(data => {
      this.operators = data;
    });
  }

  async save() {

    if (!this.form.valid) {
      this.intermediaryServiceL.presentToastError('Rellene todos los datos del formulario');
    } else {
      await this.intermediaryServiceL.presentLoading();
      this.expeManSrv.store(this.form.value).subscribe(data => {
        this.intermediaryServiceL.presentToastSuccess('Expedicion guardad con exito');
        this.close();
        this.intermediaryServiceL.dismissLoading();
      }, error => {
        this.intermediaryServiceL.presentToastError('Algunos de sus datos son incorrectos por favor de revisar');
        this.intermediaryServiceL.dismissLoading();
      });
    }


  }

  close() {
    this.modalController.dismiss();
    this.clean();
  }




  clean() {
    this.form.get('operator').setValue("");
    this.form.get('name').setValue("");
    this.form.get('lastname').setValue("")
    this.form.get('dni').setValue("")
    this.form.get('phone').setValue("data.transport.shippingPhone")
    this.form.get('direction').setValue("")
    this.form.get('province').setValue("")
    this.form.get('country').setValue("")
    this.form.get('postalcode').setValue("")
    this.form.get('packages').setValue("")
  }

  selectChange(e) {
    console.log(e);
  }
}
