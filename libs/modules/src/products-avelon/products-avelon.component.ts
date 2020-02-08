import { BehaviorSubject, of, Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import * as Filesave from 'file-saver';
import {
  ProductModel,
  ProductsService,
  FiltersService,
  FiltersModel,
  InventoryService,
  InventoryModel,
  TypesService,
  WarehouseService,
  WarehousesService,
  IntermediaryService,
  UsersService,
  PermissionsModel,
} from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { validators } from '../utils/validators';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import { TagsInputOption } from '../components/tags-input/models/tags-input-option.model';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { FilterButtonComponent } from "../components/filter-button/filter-button.component";
import { map, catchError } from 'rxjs/operators';
import { PermissionsService } from '../../../services/src/lib/endpoint/permissions/permissions.service';
import { ProductsAvelonService } from '../../../services/src/lib/endpoint/products-avelon/products-avelon.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
};



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
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-products-avelon',
  templateUrl: './products-avelon.component.html',
  styleUrls: ['./products-avelon.component.scss']
})

export class ProductsAvelonComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  seconds:any;
  constructor(
    private intermediaryService: IntermediaryService,
    private warehouseService: WarehouseService,
    private warehousesService: WarehousesService,
    private typeService: TypesService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private inventoryServices: InventoryService,
    private filterServices: FiltersService,
    private productsService: ProductsService,
    private modalController: ModalController,
    private printerService: PrinterService,
    private usersService: UsersService,
    private permisionService: PermissionsService,
    private productAvelonService: ProductsAvelonService
  ) {
  }


 

  getSecondsAvelon(){
    this.intermediaryService.presentLoading('Actualizando Avelon').then(() => {
      this.productAvelonService.GetSecondAvelon().subscribe(result => {
        this.seconds= result;
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess("Actualizacion exitosa.")
      },()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Actualizacion Fallida.");
      });
    });
  }

  notifyAvelonPredistribution(){
    this.intermediaryService.presentLoading('Notificando a avelon').then(() => {
      let body = {
        "force": true
      };
      this.productAvelonService.notifyAvelonPredistribution(body).subscribe(result => {
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastSuccess("Notificacion enviada con exito.")
      },()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentToastError("Notifiacion fallida.");
      });
    });
  }

  GetProducts(){
    this.productAvelonService.GetProducts().subscribe(result => {
      console.log(result);
      this.dataSource = result;
    });
  }

  ngOnInit(){
    this.getSecondsAvelon();
  }
}
