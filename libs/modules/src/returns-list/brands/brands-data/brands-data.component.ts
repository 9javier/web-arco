import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { NavParams } from '@ionic/angular';
import { DefectiveRegistryService } from '../../../../../services/src/lib/endpoint/defective-registry/defective-registry.service';
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-brands-data',
  templateUrl: './brands-data.component.html',
  styleUrls: ['./brands-data.component.scss']
})
export class BrandsDataComponent implements OnInit {
  form: FormGroup = this._formBuilder.group({
    brandArray: this._formBuilder.array(
      [],this.minSelectedCheckboxes()
    )
  });

  brands: {
    id: number;
    name: string;
  }[];
  providerId;

  constructor(
    private _formBuilder:FormBuilder,
    private navParams: NavParams,
    private intermediaryService: IntermediaryService,
    private defectiveRegistryService: DefectiveRegistryService,
    ) {
    this.providerId = this.navParams.get("providerId");
    const formTemp = this.navParams.get("formBrands");
    if (formTemp) {
      console.log('FORM TEMP');
      console.log(formTemp);
      this.form = formTemp;
    }
  }

  ngOnInit() {
    this.brands = [];
    this.getBrandsByProviders();
  }

  get brandArray() {
    return this.form.get('brandArray') as FormArray;
  }
  addItem(item) {
    this.brands.push(item);
    this.brandArray.push(this._formBuilder.control(false));
  }
  removeItem() {
    this.brands.pop();
    this.brandArray.removeAt(this.brandArray.length - 1);
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

  minSelectedCheckboxes(): ValidatorFn {
    const validator: ValidatorFn = (formArray: FormArray) => {

      const selectedCount = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);

      return selectedCount >= 1 ? null : { notSelected: true };
    };

    return validator;
  }

  async getBrandsByProviders() {
    await this.intermediaryService.presentLoading();

    this.defectiveRegistryService.getBrandsByProviders(this.providerId).subscribe(
      async (resp: any) => {
        const items: [] = resp;

        items.forEach((item) => {
          this.addItem(item);
        });
        // this.brands = resp;
        // console.log(this.brands);
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
}
