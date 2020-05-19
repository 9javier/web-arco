import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { SupplierConditionsService } from '../../../../../services/src/lib/endpoint/supplier-conditions/supplier-conditions.service';
import { SupplierConditionModel } from '../../../../../services/src/models/endpoints/SupplierCondition';
import { BrandModel } from '../../../../../services/src/models/endpoints/Brand';
import {ProviderModel} from "../../../../../services/src/models/endpoints/Provider";
import {IntermediaryService} from "../../../../../services/src/lib/endpoint/intermediary/intermediary.service";
import {ModalController} from "@ionic/angular";
import {SelectableListComponent} from "../selectable-list/selectable-list.component";

@Component({
  selector: 'suite-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, AfterViewInit {

  @Input() set supplierCondition(_supplierCondition){
    console.log('T:suppliercondition', _supplierCondition);
    if(_supplierCondition) {
      this.providerSelectedForm = _supplierCondition.provider;
      this.brandSelectedForm = _supplierCondition.brand;
      this.noClaimForm = _supplierCondition.noClaim;
      this.contactForm = _supplierCondition.contact;
      this.observationsForm = _supplierCondition.observations;

      if(_supplierCondition.provider){
        this.getBrands(_supplierCondition.provider.id);
      }
    }
  }

  isAdd: any;
  noClaimSelect: [
    {
      id: true,
      name: 'Sí'
    },
    {
      id: false,
      name: 'No'
    }
  ];

  form:FormGroup = this.formBuilder.group({
    provider: this.formBuilder.group({
      id:['',[Validators.required]]
    }),
    brand: this.formBuilder.group({
      id:['',[Validators.required]]
    }),
    noClaim: ['',[Validators.required]],
    contact: ['',[Validators.required]],
    observations: ['']
  });

  providers;
  brands;

  public providerSelectedForm: any = null;
  public brandSelectedForm: any = null;
  public noClaimForm: boolean = false;
  public contactForm: string = null;
  public observationsForm: string = null;

  public showSelectableList: boolean = false;
  public listItemsSelected: any[] = [];
  public itemForList: string = '';

  constructor(
    private formBuilder:FormBuilder,
    private intermediaryService:IntermediaryService,
    private supplierConditionsService:SupplierConditionsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    if(this.form['controls'].provider.value.id){
      this.isAdd=false;
    }else{
      this.isAdd=true;
    }
    this.noClaimSelect = [
      {
        id: true,
        name: 'Sí'
      },
      {
        id: false,
        name: 'No'
      }
    ];
  }

  ngAfterViewInit(){
    this.getProviders();
  }

  getProviders(){
    this.supplierConditionsService.getProviders(this.isAdd).subscribe(providers => {
        this.providers = providers;
        this.intermediaryService.dismissLoading();
    });
  }

  selectedProvider(event) {
    if (event) {
      console.log("event['detail'].value",event['detail'].value);
      this.getBrands(event['detail'].value);
    }
  }

  getBrands(providerId){
    let body = [{providerId: providerId}];
    this.supplierConditionsService.getBrandsOfProvider(body).subscribe(brands => {
      this.brands = brands;
    })
  }

  getValue() {
    return {
      provider: this.providerSelectedForm.id,
      brand: this.brandSelectedForm.id,
      noClaim: this.noClaimForm,
      contact: this.contactForm,
      observations: this.observationsForm || ''
    };
  }

  validValues() {
    return this.providerSelectedForm && this.brandSelectedForm && this.contactForm != null;
  }

  public async openShowSelectableList(type: number) {
    console.log('T:openShowSelectableList', type);
    if (type == 1) {
      this.listItemsSelected = this.providers.map(p => {
        return {id: p.id, value: p.name}
      });
      this.itemForList = 'Proveedor';
    } else if (type == 2) {
      this.listItemsSelected = this.brands.map(p => {
        return {id: p.id, value: p.name}
      });
      this.itemForList = 'Marca';
    }

    const modal = await this.modalController.create({
      component: SelectableListComponent,
      componentProps: { listItemsSelected: this.listItemsSelected, itemForList: this.itemForList }
    });
    modal.onDidDismiss().then(result => {
      if (result && result.data != null) {
        if (type == 1) {
          this.getBrands(result.data);
          this.providerSelectedForm = this.providers.find(p => p.id == result.data);
          console.log('T:this.providerSelectedForm', this.providerSelectedForm);
        } else if (type == 2) {
          this.brandSelectedForm = this.brands.find(p => p.id == result.data);
          console.log('T:this.brandSelectedForm', this.brandSelectedForm);
        }
      }
    });
    await modal.present();
  }
}
