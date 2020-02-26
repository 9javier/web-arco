import { Component, OnInit } from '@angular/core';
import { IntermediaryService, ProductsService } from '@suite/services';
import { ModalController, PopoverController } from '@ionic/angular';
import { DamagedModel } from '../../../services/src/models/endpoints/Damaged';
import { FiltersDamagedShoesComponent } from './filters-damaged-shoes/filters-damaged-shoes.component';
import { AddDamagedShoesComponent } from './add-damaged-shoes/add-damaged-shoes.component';

@Component({
  selector: 'suite-damaged-shoes',
  templateUrl: './damaged-shoes.component.html',
  styleUrls: ['./damaged-shoes.component.scss'],
})
export class DamagedShoesComponent implements OnInit {
  DEFAULT_STATUS: number = 1;
  originalPermissions: string;
  modalPermissions: DamagedModel.Permission[];
  tablePermissions: DamagedModel.Permission[];
  tableActions: DamagedModel.Action[];
  tableColumns: string[];
  filters: DamagedModel.Filters = {
    classifications: [],
    statuses: [this.DEFAULT_STATUS]
  };
  thereAreChanges: boolean;
  filterOptions: DamagedModel.FilterOption[];

  constructor(
    private intermediaryService: IntermediaryService,
    private productsService: ProductsService,
    private popoverController: PopoverController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.getData();
    this.thereAreChanges = false;
    await this.intermediaryService.dismissLoading();
  }

  async resetFilters(){
    await this.intermediaryService.presentLoading('Cargando...');
    this.filters.classifications = [];
    this.filters.statuses = [this.DEFAULT_STATUS];
    await this.getData();
    this.thereAreChanges = false;
    await this.intermediaryService.dismissLoading();
  }

  async openFilter(column: string) {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.getFilterOptions(column);
    const popover = await this.popoverController.create({
      cssClass: 'popover-filter',
      component: FiltersDamagedShoesComponent,
      componentProps: {
        title: column,
        listItems: this.filterOptions
      }
    });

    popover.onDidDismiss().then(async response => {
      if(response.data) {
        await this.intermediaryService.presentLoading('Cargando...');
        this.filterOptions = response.data.filters;
        if (column === 'Clasificaciones') {
          this.filters.classifications = [];
          for (let iOption of this.filterOptions) {
            if (iOption.checked) {
              this.filters.classifications.push(iOption.id);
            }
          }
        } else {
          this.filters.statuses = [];
          for (let iOption of this.filterOptions) {
            if (iOption.checked) {
              this.filters.statuses.push(iOption.id);
            }
          }
        }
        await this.getData();
        await this.intermediaryService.dismissLoading();
      }
    });
    await this.intermediaryService.dismissLoading();
    await popover.present();
  }

  changeAction(action: DamagedModel.Action, id: number) {
    let addingAction = true;
    for(let iPermission of this.tablePermissions){
      if(iPermission.id === id){
        for(let i = 0; i < iPermission.actions.length; i++){
          if(iPermission.actions[i].id === action.id){
            addingAction = false;
            iPermission.actions.splice(i, 1);
            break;
          }
        }
        if(addingAction){
          iPermission.actions.push(action);
        }
        break;
      }
    }
    this.thereAreChanges = JSON.stringify(this.tablePermissions) !== this.originalPermissions;
  }

  async saveChanges() {
    await this.intermediaryService.presentLoading('Cargando...');
    await this.postData();
    this.originalPermissions = JSON.stringify(this.tablePermissions);
    this.thereAreChanges = false;
    await this.intermediaryService.dismissLoading();
  }

  async newAction() {
    await this.getModalPermissions();
    const modal = await this.modalController.create({
      component: AddDamagedShoesComponent,
      componentProps: {
        tPermissions: this.modalPermissions,
        tActions: this.tableActions
      }
    });

    modal.onDidDismiss().then(async response=>{
      if (response.data) {
        await this.intermediaryService.presentLoading('Cargando...');
        const modalResponse: DamagedModel.ModalResponse = response.data;
        await this.postNewPermission(modalResponse);
        await this.getData();
        await this.intermediaryService.dismissLoading();
      }
    });

    await modal.present();
  }

  // BACK FUNCTIONS

  async getData() {
    this.tableColumns = ['classification', 'status'];
    await this.productsService.getDamagedList(this.filters).then(response => {
      const list: DamagedModel.List = response.data;
      this.originalPermissions = JSON.stringify(list.permissions);
      this.tablePermissions = list.permissions;
      this.tableActions = list.list_actions;
      if (this.tableActions.length > 0) {
        for (let action of this.tableActions) {
          this.tableColumns.push(action.id.toString());
        }
      }
    });
  }

  async getModalPermissions(){
    await this.productsService.getDamagedList({classifications: [], statuses: []}).then(response => {
      const list: DamagedModel.List = response.data;
      this.modalPermissions = list.permissions;
    });
  }

  async postData() {
    await this.productsService.postDamagedUpdate(this.tablePermissions);
  }

  async postNewPermission(data: DamagedModel.ModalResponse){
    await this.productsService.postDamagedNew(data);
  }

  async getFilterOptions(column: string) {
    const filterOptionsRequest: DamagedModel.FilterOptionsRequest = {
      type: {
        classifications: column === 'Clasificaciones',
        statuses: column === 'Estados'
      }
    };

    await this.productsService.getDamagedFilters(filterOptionsRequest).then(response => {
      const filters: DamagedModel.FilterOptions = response.data;

      console.log(filters);
      this.filterOptions = column === 'Clasificaciones' ? filters.classifications : filters.statuses;
    });

    if(column === 'Clasificaciones'){
      for(let iOption of this.filterOptions){
        iOption.checked = this.filters.classifications.includes(iOption.id);
      }
    }else{
      for(let iOption of this.filterOptions){
        iOption.checked = this.filters.statuses.includes(iOption.id);
      }
    }
  }

  // OTHER FUNCTIONS

  isFiltering(column: string): string {
    switch(column){
      case 'classification':
        if(this.filters.classifications.length > 0){
          return 'playlist_add_check';
        }else{
          return 'reorder';
        }
      case 'status':
        if(this.filters.statuses.length > 0){
          return 'playlist_add_check';
        }else{
          return 'reorder';
        }
    }
  }

  isChecked(action: DamagedModel.Action, permissionActions: DamagedModel.Action[]): boolean {
    for(let iAction of permissionActions){
      if(iAction.id === action.id){
        return true;
      }
    }
    return false;
  }

}
