import { Component, Input, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Location } from "@angular/common";
import { SelectionModel, DataSource } from "@angular/cdk/collections";
import { RolModel, UserModel, WarehouseModel, IntermediaryService } from "@suite/services";
import { Observable, of } from "rxjs";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { HallModel } from "../../../../services/src/models/endpoints/Hall";
import { HallsService } from "../../../../services/src/lib/endpoint/halls/halls.service";
import { ActivatedRoute } from "@angular/router";
import { ModalController, ToastController, NavParams } from "@ionic/angular";
import { WarehouseService } from "../../../../services/src/lib/endpoint/warehouse/warehouse.service";
/*import {UpdateComponent} from "../update/update.component";
import { UpdateComponent as updateHall } from '../../halls/update/update.component';
import { EnableLockContainerComponent } from '../modals/enable-lock-container/enable-lock-container.component';
import {LocationsComponent} from "../locations.component";
import {MoveProductsComponent} from "../modals/move-products/move-products.component";*/
import { PrinterService } from "../../../../services/src/lib/printer/printer.service";
import { CrudService } from '../../../../common/ui/crud/src/lib/service/crud.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { validators } from '../../utils/validators';
import { StoreComponent } from './modals-zone/store/store.component';
import { UpdateComponent } from './modals-zone/update/update.component';
import { WarehousesModalComponent } from './modals-zone/warehouses-modal/warehouses-modal.component';
import { RailsConfigurationComponent } from './modals-zone/rails-configuration/rails-configuration.component';
import { TemplateZonesService } from '../../../../services/src/lib/endpoint/template-zones/template-zones.service';
import { TemplateZoneModel } from '../../../../services/src/models/endpoints/TemplateZone';
import { TemplateColorsService } from 'libs/services/src/lib/endpoint/template-colors/template-colors.service';
import { TemplateColorsModel } from 'libs/services/src/models/endpoints/TemplateColors';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { SorterService } from 'libs/services/src/lib/endpoint/sorter/sorter.service';
import { MatrixSelectWaySorterComponent } from './components/matrix-select-way-sorter/matrix-select-way-sorter.component';


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

  displayedColumns = [];
  dataSource = new ExampleDataSource();
  warehouses: WarehouseModel.Warehouse[] = [];
  displayedColumnsWareHouse: any = ['check', 'name'];
  displayedData = ['prioridad', 'calle'];
  data = [];
  dataSource2 = new MatTableDataSource<Element>(this.data);
  selectedForm: FormGroup;
  selectedFormActive: FormGroup;
  radioForm: FormGroup;
  items: FormArray;
  showRails: boolean = false;
  id: string;
  postRoute: string;
  zones: TemplateZoneModel.Zone[];
  colors: TemplateColorsModel.TemplateColors[];
  test_counter: number;
  toDeleteIds: number[] = [];
  waysMatrix = [];
  ways = [];
  firstSorter;
  zoneId: number;
  equalParts: any;

  //Get value on ionChange on IonRadioGroup
  selectedRadioGroup: any;
  //Get value on ionSelect on IonRadio item
  selectedRadioItem: any;

  rails = []
  firstClick: boolean = true;
  radioDisplay: boolean = false;
  wayClicked: boolean = true;
  priority: number = 1;

  radioButton: any;

  @ViewChild(MatrixSelectWaySorterComponent) matrixSelectWay: MatrixSelectWaySorterComponent;

  public validSave: boolean = false;

  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private templateZonesService: TemplateZonesService,
    private templateColorsService: TemplateColorsService,
    private sorterService: SorterService,
    private changeDetectorRefs: ChangeDetectorRef,
    private intermediaryService: IntermediaryService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.equalParts = this.route.snapshot.paramMap.get('equalParts');
    this.postRoute = `Plantilla ${this.id}`;
    if(this.equalParts === 'false'){
      this.displayedColumns = ['delete', 'Ntemplate', 'nombre'/*, 'active'*/, /*'configurarCarriles',*/ 'warehoures', 'color', 'quantity', 'updateCarriles']
      this.selectedForm = this.formBuilder.group(
        {
          selector: false,
          selects: this.formBuilder.array([this.createSelect()])
        },
        {
          validators: validators.haveItems('toSelect')
        }
      );
    } else {
      this.displayedColumns = ['Ntemplate', 'nombre', 'warehoures', 'color', 'quantity', 'updateCarriles']
    }
    //console.log(this.selectedForm)

    /*this.selectedFormActive = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([ this.createSelect() ])
      },
      {
        validators: validators.haveItems('toSelectActive')
      }
    );*/

    this.radioForm = this.formBuilder.group(
      {
        selector: false,
        selects: this.formBuilder.array([this.createSelect()])
      },
      {
        validators: validators.haveItems('toSelectRadio')
      }
    );
    
  }


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;
  showExpasion: boolean = false;

  ngOnInit() {
    setTimeout(() => {
      this.validSave = true;
    }, 2000);
    this.crudService
      .getIndex('Warehouses')
      .then(
        (data: Observable<HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>>) => {
          data.subscribe(
            (res: HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>) => {
              this.warehouses = res.body.data;
              if(this.equalParts === 'false')
                this.initSelect(this.warehouses);
            },
            (err) => {
              console.log(err)
            }
          );
        }
      );
    this.templateColorsService.getIndex().subscribe((data) => {
      this.colors = data.data;
    })
    this.templateZonesService.getIndex(parseInt(this.id)).subscribe((data) => {
      this.zones = data.data;
      this.radioButton = this.zones[0].id;
      this.radioForm = this.formBuilder.group({
        selectRadio: [this.radioButton]
      });
      //this.initSelectActive(this.zones);
      //this.initRadioActive(this.zones);
    });
    this.test_counter = 0;

    this.sorterService.getFirstSorter().subscribe(data => {
      this.firstSorter = data;
      //console.log(this.firstSorter)
      this.templateZonesService.getMatrixByTemplate(Number(this.firstSorter.id), Number(this.id)).subscribe((data) => {
        this.waysMatrix = data.data;
        //console.log(this.waysMatrix)
      }, (err) => {
        console.log(err)
      });
    }, err => {
      console.log(err)
    });

    this.templateZonesService.getTemplateZonesAndWays(Number(this.id)).subscribe((data) => {
      this.ways = data.data;
    }, (err) => {
      console.log(err)
    });
  }

  getZones() {
    this.templateZonesService.getIndex(parseInt(this.id)).subscribe((data) => {
      this.zones = data.data;
      this.radioButton = this.zones[0].id;
      this.radioForm = this.formBuilder.group({
        selectRadio: [this.radioButton]
      });
      //this.initSelectActive(this.zones);
      this.initRadioActive(this.zones);
    });
  }

  clickShowExpasion(row: any) {
    event.stopPropagation();
    console.log(row)
    this.expandedElement = row;
    this.showExpasion = !this.showExpasion;
    row.dropdown = this.showExpasion;
  }

  selectAll(event): void {
    let value = event.detail.checked;
    const controlArray = <FormArray>this.selectedForm.get('toSelect');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
    this.toDeleteIds = [];
    this.zones.forEach(template => {
      this.toDeleteIds.push(template.id);
    });
  }

  initSelect(items) {
    this.selectedForm.removeControl('toSelect');
    this.selectedForm.addControl('toSelect', this.formBuilder.array(items.map(item => new FormControl(Boolean(false)))));
  }

  /*selectAllActive(event):void{
    let value = event.detail.checked;
    const controlArray = <FormArray> this.selectedFormActive.get('toSelectActive');
    controlArray.controls.forEach((control, i) => {
      control.setValue(value);
    });
  }

  initSelectActive(items: TemplateZoneModel.Zone[]) {
    this.selectedFormActive.removeControl('toSelectActive');
    this.selectedFormActive.addControl('toSelectActive', this.formBuilder.array(items.map(item => new FormControl(Boolean(item.active)))));
  }*/

  initRadioActive(items: TemplateZoneModel.Zone[]) {
    this.radioForm.removeControl('toSelectRadio');
    this.radioForm.addControl('toSelectRadio', this.formBuilder.array(items.map(item => new FormControl(item.id))));
  }

  createSelect(): FormControl {
    return new FormControl(Boolean(false));
  }

  async update(row): Promise<void> {
    let modal = (await this.modalController.create({
      component: UpdateComponent,
      componentProps: {
        zonaId: row.id,
        colors: this.colors,
        id: this.id
      }
    }));
    modal.present();
  }

  async store(): Promise<void> {
    let modal = (await this.modalController.create({
      component: StoreComponent,
      componentProps: {
        colors: this.colors,
        id: this.id
      }
    }));
    modal.onDidDismiss().then(() => {
      this.intermediaryService.presentLoading();
      this.templateZonesService.getIndex(parseInt(this.id)).subscribe((data) => {
        this.zones = data.data;
        console.log(this.zones);
        this.radioButton = this.zones[0].id;
        this.radioForm = this.formBuilder.group({
          selectRadio: [this.radioButton]
        });
        //this.initSelectActive(this.zones);
        this.initRadioActive(this.zones);
        this.intermediaryService.dismissLoading();
      });
    })
    modal.present();
  }

  getColumn(index: number, column: number, height: number, way): void {
    this.firstClick = false;
    this.cleanStyles();

    this.waysMatrix.forEach(way => {
      if (way.height === height) {
        let columns = way.columns;
        for (let i = 0; i < columns.length; i++)
          if (column == columns[i].ways_number) {
            columns[i]['selected'] = true;
            columns[i]['adjacent'] = false;
            console.log('Current: ' + column)
            if (columns[i - 1] && !columns[i - 1]['selected']) {
              columns[i - 1]['adjacent'] = true;
            }
            if (columns[i + 1] && !columns[i + 1]['selected']) {
              columns[i + 1]['adjacent'] = true;
            }
          }
      }
    });

    for (let i = 0; i < this.waysMatrix.length; i++) {
      if (this.waysMatrix[i].height == height) {
        if (this.waysMatrix[i - 1]) {
          for (let j = 0; j < this.waysMatrix[i - 1].columns.length; j++) {
            if (j == index && !this.waysMatrix[i - 1].columns[j]['selected']) {
              this.waysMatrix[i - 1].columns[j]['adjacent'] = true;
            }
          }
        }
        if (this.waysMatrix[i + 1]) {
          for (let j = 0; j < this.waysMatrix[i + 1].columns.length; j++) {
            if (j == index && !this.waysMatrix[i + 1].columns[j]['selected']) {
              this.waysMatrix[i + 1].columns[j]['adjacent'] = true;
            }
          }
        }
      }
    }


    let wayNumber: number;
    let wayColumn: number;
    console.log(way)
    console.log(this.zoneId)
    let zones = [
      {
        zone: this.zoneId,
        ways: [
          {
            waysId: way.way.id,
            priority: this.priority
          }
        ]
      }
    ];

    let payload = {
      zones
    }

    this.templateZonesService.assignWays(payload, Number(this.id)).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })

    this.waysMatrix.forEach(item => {
      item.columns.forEach(item => {
        if (item.way.id === way.way.id) {
          wayNumber = item.priority;
          wayColumn = way.ways_number
        }
      })
    });

    let value = {
      position: this.priority,
      name: wayColumn
    }
    this.priority++;
    this.data.push(value);
    this.dataSource2 = new MatTableDataSource<Element>(this.data);
  }

  cleanColumn(index: number, column: number, height: number, way): void {

    this.data.forEach(item => {
      if (item.name == way.ways_number) {
        let newData = this.data.filter(item => item.name != way.ways_number);
        this.data = newData;
      }
    });
    this.dataSource2 = new MatTableDataSource<Element>(this.data);

    this.waysMatrix.forEach(way => {
      if (way.height === height) {
        let columns = way.columns;
        for (let i = 0; i < columns.length; i++)
          if (column == columns[i].ways_number) {
            columns[i]['selected'] = false;
            if (columns[i - 1] && !columns[i - 1]['selected']) {
              columns[i - 1]['adjacent'] = false;
            } else if (columns[i - 1] && columns[i - 1]['selected']) {
              columns[i]['adjacent'] = true;
            }
            if (columns[i + 1] && !columns[i + 1]['selected']) {
              columns[i + 1]['adjacent'] = false;
            } else if (columns[i + 1] && columns[i + 1]['selected']) {
              columns[i]['adjacent'] = true;
            }
          }
      }
    });

    for (let i = 0; i < this.waysMatrix.length; i++) {
      if (this.waysMatrix[i].height == height) {
        if (this.waysMatrix[i - 1]) {
          for (let j = 0; j < this.waysMatrix[i - 1].columns.length; j++) {
            if (j == index && !this.waysMatrix[i - 1].columns[j]['selected']) {
              this.waysMatrix[i - 1].columns[j]['adjacent'] = false;
            } else if (j == index && this.waysMatrix[i - 1].columns[j]['selected']) {
              this.waysMatrix[i].columns[j]['adjacent'] = true;
            }
          }
        }
        if (this.waysMatrix[i + 1]) {
          for (let j = 0; j < this.waysMatrix[i + 1].columns.length; j++) {
            if (j == index && !this.waysMatrix[i + 1].columns[j]['selected']) {
              this.waysMatrix[i + 1].columns[j]['adjacent'] = false;
            } else if (j == index && this.waysMatrix[i + 1].columns[j]['selected']) {
              this.waysMatrix[i].columns[j]['adjacent'] = true;
            }
          }
        }
      }
    }

    this.firstClick = true;
  }


  cleanStyles() {
    console.log(this.rails)
    this.rails.forEach(rail => {
      rail.columns.forEach(column => {
        column['adjacent'] = false;
      });
    });
  }

  active() {
    event.stopPropagation();
    console.log('active')
  }

  toDeleteZone(index) {
    event.stopPropagation();
    let repeat = false;
    let idToDelete = this.zones[index].id;
    this.toDeleteIds.forEach(id => {
      if (id == idToDelete) {
        repeat = true;
      }
    })
    if (!repeat) {
      this.toDeleteIds.push(idToDelete);
    }
  }

  delete() {
    let deletions: Observable<any> = new Observable(observer => observer.next());
    if (this.toDeleteIds.length > 0) {
      this.toDeleteIds.forEach(idZone => {
        deletions = deletions.pipe(switchMap(() => {
          return (this.templateZonesService.deleteTemplateZone(idZone, Number(this.id)))
        }))
      });
    }

    this.toDeleteIds = [];
    this.intermediaryService.presentLoading();

    deletions.subscribe(() => {
      this.intermediaryService.dismissLoading();
      this.getZones();
      this.intermediaryService.presentToastSuccess("Plantillas eliminadas con exito");
      const controlArray = <FormArray>this.selectedForm.get('toSelect');
      controlArray.controls.forEach((control, i) => {
        control.setValue(false);
      });
    }, () => {
      this.intermediaryService.dismissLoading();
      this.getZones();
      this.intermediaryService.presentToastError("No se pudieron eliminar algunas de las plantillas");
    });
  }

  async openWarehousesModal(id) {
    let zoneByWarehouses = this.zones.filter(zone => zone.id == id);
    console.log(zoneByWarehouses[0].zoneWarehouses)
    event.stopPropagation();
    let modal = (await this.modalController.create({
      component: WarehousesModalComponent,
      componentProps: {
        warehouses: zoneByWarehouses[0].zoneWarehouses,
        idTemplate: this.id,
        id: zoneByWarehouses[0].id
      }
    }));
    modal.onDidDismiss().then(() => {
      this.intermediaryService.presentLoading();
      this.templateZonesService.getIndex(parseInt(this.id)).subscribe((data) => {
        this.zones = data.data;
        this.radioButton = this.zones[0].id;
        this.radioForm = this.formBuilder.group({
          selectRadio: [this.radioButton]
        });
        //this.initSelectActive(this.zones);
        this.initRadioActive(this.zones);
        this.intermediaryService.dismissLoading();
      });
    })
    modal.present();
  }

  async openRailsConfiguration() {
    event.stopPropagation();
    let modal = (await this.modalController.create({
      component: RailsConfigurationComponent
    }));
    modal.present();
  }

  displayRails() {
    event.stopPropagation();
    this.showRails = !this.showRails;
  }

  displayRailsRadio(element) {
    event.stopPropagation();
    this.zoneId = element.id;
    this.showRails = true;
  }

  radioGroupChange(event) {
    //console.log("radioGroupChange",event.detail);
    this.selectedRadioGroup = event.detail;
  }

  radioFocus() {
    //console.log("radioFocus");
  }
  radioSelect(event) {
    //console.log("radioSelect",event.detail);
    this.selectedRadioItem = event.detail;
  }
  radioBlur() {
    //console.log("radioBlur");
  }

  storeWays(data){
    this.intermediaryService.presentLoading();
    var info = {
      zones: data
    }
    this.templateZonesService.assignWays(info, parseInt(this.id)).subscribe(() => {
      this.intermediaryService.presentToastSuccess("Carriles guardados con éxito");
      this.templateZonesService.getIndex(parseInt(this.id)).subscribe((data) => {
        this.zones = data.data;
        this.radioButton = this.zones[0].id;
        this.radioForm = this.formBuilder.group({
          selectRadio: [this.radioButton]
        });
        //this.initSelectActive(this.zones);
        this.initRadioActive(this.zones);
        this.intermediaryService.dismissLoading();
      });
    }, () => {
      this.intermediaryService.presentToastError("Error al guardar, intente más tarde");
      this.intermediaryService.dismissLoading();
    });
  }

}

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  data = [
    { icon: '', Ntemplate: 1, zona: 2, nombre: 'zone1', carriles: 25, dropdown: false },
    { icon: '', Ntemplate: 2, zona: 2, nombre: 'zone2', carriles: 45, dropdown: false },
    { icon: '', Ntemplate: 3, zona: 2, nombre: 'zone3', carriles: 65, dropdown: false },
  ];
  connect(): Observable<Element[]> {
    const rows = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    //console.log(rows);
    return of(rows);
  }

  disconnect() { }
}

export class ExampleDataSource2 extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */

  connect(): Observable<Element[]> {
    const rows = [];
    // this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    //console.log(rows);
    return of(rows);
  }


  disconnect() { }

  addCarriles() {
    //console.log("aqui")
  }
}
