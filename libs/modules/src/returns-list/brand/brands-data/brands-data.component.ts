import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DefectiveRegistryService } from '../../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';

@Component({
  selector: 'suite-brands-data',
  templateUrl: './brands-data.component.html',
  styleUrls: ['./brands-data.component.scss'],
})
export class BrandsDataComponent implements OnInit {
  brands:Array<{ id: number, name: string }> = [];

  form:FormGroup = this.formBuilder.group({
    providers:['',[Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private defectiveRegistryService: DefectiveRegistryService,
  ) { }

  ngOnInit() {}

}
