import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IntermediaryService } from '@suite/services';
import { ModalController } from '@ionic/angular';
import { BrandsStoreComponent } from '../../brand/brands-store/brands-store.component';
import { DefectiveRegistryService } from '../../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  providers:Array<{ id: number, name: string }> = [];
  types:Array<{ id: number, name: string }> = [];

  form:FormGroup = this.formBuilder.group({
    id:'',
    provider:['',[Validators.required]],
    type:['',[Validators.required]],
    date:['',[Validators.required]],
    brands:['',[Validators.required]]
  });

  @Input() set group(_group){
    if(_group)
      this.form.patchValue(_group);
  }
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
      (resp: any) => {
        this.providers = resp;
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
    });
    modal.onDidDismiss().then(async () => {
      // await this.getData();
    });
    await modal.present();
  }
}
