import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { DefectiveRegistryService } from '../../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-brands-data',
  templateUrl: './brands-data.component.html',
  styleUrls: ['./brands-data.component.scss']
})
export class BrandsDataComponent implements OnInit {
  brands:Array<{ id: number, name: string }> = [];
  providerId;
  form:FormGroup = this.formBuilder.group({
    brands:[this.formBuilder.array([]),[Validators.required]]
  });

  constructor(
    private formBuilder:FormBuilder,
    private navParams: NavParams,
    private intermediaryService: IntermediaryService,
    private defectiveRegistryService: DefectiveRegistryService,
    ) {
    this.providerId = this.navParams.get("providerId");
  }

  ngOnInit() {
    this.getBrandsByProviders();
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

  async getBrandsByProviders() {
    await this.intermediaryService.presentLoading();

    this.defectiveRegistryService.getBrandsByProviders(this.providerId).subscribe(
      async (resp: any) => {
        this.brands = resp;
        console.log(this.brands);
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

  onChange(event) {
    const brands = <FormArray>this.form.get('brands') as FormArray;

    console.log(event);
    // if(event.checked) {
    //   brands.push(new FormControl(event.source.value))
    // } else {
    //   const i = brands.controls.findIndex(x => x.value === event.source.value);
    //   brands.removeAt(i);
    // }

    console.log(brands);
  }
}
