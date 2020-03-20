import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IntermediaryService } from '@suite/services';
import { ModalController } from '@ionic/angular';
import { DefectiveRegistryService } from '../../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { BrandsStoreComponent } from '../../brands/brands-store/brands-store.component';

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  disableAddBrands = true;
  providers:Array<{ id: number, name: string }> = [];
  brandsSelected:Array<{ id: number, name: string }> = [];
  types:Array<{ id: number, name: string }> = [];

  form: FormGroup = this.formBuilder.group({
    id:'',
    provider:['',[Validators.required]],
    type:['',[Validators.required]],
    date:['',[Validators.required]],
    brands:['',[Validators.required]]
  });

  formBrands: FormGroup;

  constructor(
    private defectiveRegistryService: DefectiveRegistryService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getProviders();
    this.getTypes();
  }

  async getProviders() {
    await this.intermediaryService.presentLoading();

    this.defectiveRegistryService.getProviders().subscribe(
      async (resp: any) => {
        this.providers = resp;
        await this.intermediaryService.dismissLoading()
      },
      async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading()
      },
      async () => {
        await this.intermediaryService.dismissLoading()
      }
    )
  }

  async getTypes() {
    this.types = [
      {
        id: 1,
        name: 'Tipo 1'
      },
      {
        id: 2,
        name: 'Tipo 2'
      },
      {
        id: 3,
        name: 'Tipo 3'
      }
    ]
  }

  sanitize(object){
    let keys:Array<string> = Object.keys(object);
    keys.forEach(key=>{
      if(!object[key]){
        delete object[key];
      }
    });
    return object;
  }

  getValue(){
    return this.sanitize(this.form.value);
  }

  async addBrand() {
    let modal = await this.modalController.create({
      component: BrandsStoreComponent,
      componentProps: {
        providerId: this.form.get('provider').value,
        formBrands: this.formBrands
      },
      backdropDismiss: false
    });
    modal.onDidDismiss().then(async (dataReturn) => {
      if (dataReturn.data !== undefined) {
        this.formBrands = dataReturn.data;
      }
    });
    await modal.present();
  }

  selectedProvider() {
    if (this.form.get('provider').value) {
      this.disableAddBrands = false;
    }
  }
}
