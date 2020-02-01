import { Component, OnInit, Input} from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import {HistoryWarehouseModalComponent} from './history-warehouse-modal/history_whs_modal.component';
import { CarrierService, WarehouseModel, IntermediaryService } from '@suite/services';
import { Validators, FormBuilder, FormGroup, FormArray,  FormControl, } from '@angular/forms';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
{position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
{position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
{position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
{position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
{position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
{position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
{position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
{position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
{position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'history-warehouse',
  templateUrl: './history-warehouse.component.html',
  styleUrls: ['./history-warehouse.component.scss']
})

export class HistoryWarehouseComponent implements OnInit {
  title = 'Destinos';
  redirectTo = '/jails';
  destinations;
  jail;

  dataSource = ELEMENT_DATA;

  private datemin = "2020-01-01";
  private datemax = "2020-02-27";
  private whsCode = 6;
  private whs: any;

  formVar: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: HistoryWarehouseModalComponent,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService,
    private fb: FormBuilder,
  ) {

  }

  // -----------

  getCarriers(): void {
    this.intermediaryService.presentLoading();
    this.carrierService.getAllWhs().subscribe(carriers => {
      this.whs = carriers;
      this.intermediaryService.dismissLoading();
    })
  }

  getAllInfo(){
    let body={
      warehouse:this.whsCode,
      startDate:this.datemin.toString(),
      endDate:this.datemax.toString(),
    };
    this.carrierService.postMovementsHistory(body).subscribe(sql_result => {
      let results = sql_result;



      let history_results = results['historyList'];

      console.log(results);
      console.log(history_results);

    });
  }


  // ----------------

  ngOnInit() {
    this.getCarriers();
    this.formVar = this.fb.group({
      warehouse: '',
      beginDate: '',
      endDate: ''
    });
  }


  getWarehouse(){

  }



}
