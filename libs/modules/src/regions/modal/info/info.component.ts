import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { flatMap, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { 
  CountryModel,
  ProvinceModel,
  PostalCodeModel,
  CountryService,
  ProvinceService,
  IntermediaryService
} from '@suite/services';

@Component({
  selector: 'suite-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  /**for send the data of the value */
  @Output() submit = new EventEmitter();
  // tslint:disable-next-line: no-input-rename
  @Input('region') region: any;


  countries: Array<CountryModel.Country> = [];
  provinces: Array<ProvinceModel.Province> = [];
  provincesSelected: Array<ProvinceModel.Province> = [];
  postalCodes: Array<PostalCodeModel.PostalCode> = [];

  form: FormGroup = this.formBuilder.group({
    id: new FormControl(),
    country: new FormControl({ value: 0 }, [Validators.required]),
    province: new FormControl({ value: 0 }, [Validators.required]),
    postalCode: new FormControl({ value: 0 }, [Validators.required]),
  });

  constructor(
    private countryService: CountryService,
    private provinceService: ProvinceService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private intermediaryService: IntermediaryService,
  ) { }

  ngOnInit() {
    this.init();
    if (this.region) {
      console.log(this.region.id);
      this.form.patchValue({
        id: this.region.id,
        country: this.region.country.id,
        province: this.region.province.id,
        postalCode: this.region.postalCode.id,
      });
    }

    console.log(this.form.value)

  }


  init() {
    this.intermediaryService.presentLoading();
    this.countryService.list().pipe(
      flatMap(
        countries => this.provinceService.list().pipe(
          map(
            provinces => {
              return { countries, provinces }
            }
          )
        ),
      ),
    ).subscribe(resp => {
      this.countries = resp.countries;
      this.provinces = resp.provinces;
      console.log(this.countries);
      console.log(this.provinces);
      if(this.region){
        this.initforms()
      }

    },
      e => console.log(e),
      () => this.intermediaryService.dismissLoading()
    );
    console.log(this.region);

    this.form.controls['country'].enable();
    this.form.controls['province'].disable();
    this.form.controls['postalCode'].disable();

    

  }


  initforms() {
    if(this.region && this.region.id) {
      this.provinceSelection(this.region.country.id)
      this.postalCodeSelection(this.region.province.id)
    }
  }

  /**
   * close the current instance of update modal
   */
  close(): void {
    this.modalController.dismiss();
  }

  /**
   * Send the data to the parent component
   */
  submitData(): void {
    this.submit.emit(this.form.value);
  }
  changeCountry(e) {
    const id = e.detail.value;
    console.log('id', id);
    this.provinceSelection(id);
  }

  changeProvincia(e) {
    const id = e.detail.value;
    console.log('id', id);
    this.postalCodeSelection(id);
  }



  provinceSelection(countryId: number) {
    console.log(countryId);
    if (countryId) {
      if(!this.region){
        this.form.controls['province'].patchValue(0)
        this.form.controls['postalCode'].patchValue(0)
      }
      console.log(this.countries)
      const result = this.countries.find(element => element.id === countryId)
      console.log(result);

      this.provincesSelected = result.provinces;
      if ([] !== this.provincesSelected) {
        this.form.controls['province'].enable();
      }

    }
  }

  postalCodeSelection(porvinceId: number) {
    if (porvinceId) {
      if(!this.region) {
        this.form.controls['postalCode'].patchValue(0);
      }
      console.log(this.provinces)
      const result = this.provinces.find(element => element.id === porvinceId)
      console.log(result);

      this.postalCodes = result.postalCodes;
      if (undefined !== this.postalCodes) {
        this.form.controls['postalCode'].enable();
      }
    }
  }
}
