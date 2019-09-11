import {Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Location} from "@angular/common";
import {SelectionModel} from "@angular/cdk/collections";
import {RolModel, UserModel, WarehouseModel} from "@suite/services";
import {Observable, of} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HallModel} from "../../../../services/src/models/endpoints/Hall";
import {HallsService} from "../../../../services/src/lib/endpoint/halls/halls.service";
import {ActivatedRoute} from "@angular/router";
import {ModalController, ToastController, NavParams} from "@ionic/angular";
import {WarehouseService} from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
/*import {UpdateComponent} from "../update/update.component";
import { UpdateComponent as updateHall } from '../../halls/update/update.component';
import { EnableLockContainerComponent } from '../modals/enable-lock-container/enable-lock-container.component';
import {LocationsComponent} from "../locations.component";
import {MoveProductsComponent} from "../modals/move-products/move-products.component";*/
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";


@Component({
  selector: 'suite-list-sorter',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateY(0)' })),
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.17s ease-in-out')
      ]),
      transition(':leave', [
        animate('0.17s ease-in-out', style({ transform: 'translateY(100%)' }))
      ])
    ]),
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', visibility: 'hidden', padding: '0' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['icon', 'down', 'Ntemplate', 'zona', 'row'];
  dataSource = [
    { icon: '', Ntemplate: 1, zona: 2 },
    { icon: '', Ntemplate: 2, zona: 2 },
    { icon: '', Ntemplate: 3, zona: 2 },
  ];

  constructor(
    private location: Location,
    private hallsService: HallsService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private warehouseService: WarehouseService,
    private modalController: ModalController,
    private changeDetector:ChangeDetectorRef,
    private printerService: PrinterService
  ) {
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('down');
    
  
  

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
