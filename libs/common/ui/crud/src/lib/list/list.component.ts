import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { UserModel, RolModel, JailModel } from '@suite/services';
import { CrudService } from '../service/crud.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, last, take, distinctUntilChanged } from 'rxjs/operators';
import {
  AlertController,
  ToastController,
  ModalController,
  LoadingController
} from '@ionic/angular';
import { Location } from '@angular/common';
import { UpdateComponent as updateUser } from '../../../../../../modules/src/users/update/update.component';
import { StoreComponent as storeUser } from '../../../../../../modules/src/users/store/store.component';

//import { StoreComponent as storeUser } from "../../../../../../../apps/sga/src/app/users/store/store.component";
import { StoreComponent as storeRol } from "../../../../../../modules/src/roles/store/store.component";
import { StoreComponent as storeHall } from "../../../../../../modules/src/halls/store/store.component";
import { StoreComponent as storeWarehouse } from "../../../../../../modules/src/warehouses/store/store.component";
import { StoreComponent as storeJail } from "../../../../../../modules/src/jail/store/store.component";
import { StoreComponent as storePallet } from "../../../../../../modules/src/pallets/store/store.component";
import { StoreComponent as storeGroup } from "../../../../../../modules/src/groups/store/store.component";
//import { UpdateComponent as updateUser } from "../../../../../../../apps/sga/src/app/users/update/update.component";
import { UpdateComponent as updateRol } from "../../../../../../modules/src/roles/update/update.component";
import { UpdateComponent as updateHall } from "../../../../../../modules/src/halls/update/update.component";
import { UpdateComponent as updateWarehouse } from "../../../../../../modules/src/warehouses/update/update.component";
import { UpdateComponent as updateJail } from "../../../../../../modules/src/jail/update/update.component";
import { UpdateComponent as updatePallet } from "../../../../../../modules/src/pallets/update/update.component";
import { UpdateComponent as updateGroup } from "../../../../../../modules/src/groups/update/update.component";
import { HallsService } from "../../../../../../services/src/lib/endpoint/halls/halls.service";
import { HallModel } from "../../../../../../services/src/models/endpoints/Hall";
import { WarehouseService } from "../../../../../../services/src/lib/endpoint/warehouse/warehouse.service";
import { PrinterService } from "../../../../../../services/src/lib/printer/printer.service";
import { PdfGeneratorService } from "../../../../../../services/src/lib/pdf-generator/pdf-generator.service";


@Component({
  selector: 'suite-ui-crud-list',
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
    ])
  ]
})
export class ListComponent implements OnInit {
  constructor(
    private crudService: CrudService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController,
    public loadingController: LoadingController,
    private hallsService: HallsService,
    private route: ActivatedRoute,
    private location: Location,
    private warehouseService: WarehouseService,
    private printerService: PrinterService,
    private pdfGeneratorService: PdfGeneratorService
  ) {

    // Create a new Observable that publishes only the NavigationStart event
    this.navStart = router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationEnd>;
  }

  @Input() title: string;
  @Input() apiEndpoint: string;
  @Input() dataColumns: string[];
  @Input() displayedColumns: string[];
  @Input() routePath: string;
  @Input() printable: boolean;

  // Presentation Layer
  dataSource: any[] = [];
  selection = new SelectionModel<UserModel.User | RolModel.Rol>(true, []);
  navStart: Observable<NavigationStart>;
  routerTo: string;

  showDeleteButton = false;
  isLoading = false;

  warehouseSelected: number = 1;

  paramsReceived: any = null;
  parentPage: string = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.paramsReceived = params;
    });

    this.loadData();
  }

  loadData() {
    if (this.routePath == '/roles' || this.routePath == '/users' || this.routePath == '/warehouses' || this.routePath == '/jails' || this.routePath == '/pallets' || this.routePath == '/groups') {
      this.initUsers();
      this.parentPage = null;
    } else if (this.routePath == '/halls' || this.routePath == '/locations') {
      this.warehouseSelected = this.paramsReceived.params.id;
      this.initHalls();
      this.parentPage = 'Almacenes';
    }
  }

  initHalls() {
    this.presentLoading();
    this.hallsService
      .getIndex(this.warehouseSelected)
      .then(
        (
          data: Observable<
            HttpResponse<HallModel.ResponseIndex | RolModel.ResponseIndex>
          >
        ) => {
          data.subscribe(
            (
              res: HttpResponse<
                HallModel.ResponseIndex
              >
            ) => {
              this.dataSource = res.body.data;
            },
            (err) => {
              // console.log(err)
            }, () => {
              this.dismissLoading();
            }
          );
        }
      );
    this.selection = new SelectionModel<UserModel.User | RolModel.Rol>(
      true,
      []
    );
    this.showDeleteButton = false;
  }

  initUsers() {
    this.presentLoading();
    this.crudService
      .getIndex(this.apiEndpoint)
      .then(
        (
          data: Observable<
            HttpResponse<UserModel.ResponseIndex | RolModel.ResponseIndex>
          >
        ) => {
          data.subscribe(
            (
              res: HttpResponse<
                UserModel.ResponseIndex | RolModel.ResponseIndex
              >
            ) => {
              this.dataSource = res.body.data;

            },
            (err) => {

            }, () => {
              this.dismissLoading();
            }
          );
        }
      );
    this.selection = new SelectionModel<UserModel.User | RolModel.Rol>(
      true,
      []
    );
    this.showDeleteButton = false;
  }

  goPreviousPage() {
    this.location.back();
  }

  async goToStore() {
    let storeComponent = null;
    let componentProps: any = { routePath: this.routePath };

    if (this.routePath == '/roles') {
      storeComponent = storeRol;
    } else if (this.routePath == '/users') {
      storeComponent = storeUser;
    } else if (this.routePath == '/halls') {
      storeComponent = storeHall;
      componentProps.warehouse = this.warehouseSelected;
    } else if (this.routePath == '/warehouses') {
      storeComponent = storeWarehouse;
    } else if (this.routePath == '/jails') {
      storeComponent = storeJail;
    } else if (this.routePath == '/groups') {
      storeComponent = storeGroup;
    } else if (this.routePath == '/pallets') {
      storeComponent = storePallet;
    }

    if (storeComponent) {
      const modal = await this.modalController.create({
        component: storeComponent,
        componentProps: componentProps
      });

      modal.onDidDismiss()
        .then(() => {
          this.loadData();
        });

      return await modal.present();
    }
  }

  async goToUpdate(row) {
    let updateComponent = null;

    if (this.routePath == '/roles') {
      updateComponent = updateRol;
    } else if (this.routePath == '/users') {
      updateComponent = updateUser;
    } else if (this.routePath == '/halls') {
      updateComponent = updateHall;
    } else if (this.routePath == '/warehouses') {
      updateComponent = updateWarehouse;
    } else if (this.routePath == '/jails') {
      updateComponent = updateJail;
    } else if (this.routePath == '/pallets') {
      updateComponent = updatePallet;
    } else if (this.routePath == '/groups') {
      updateComponent = updateGroup;
    }

    if (updateComponent) {
      const modal = await this.modalController.create({
        component: updateComponent,
        componentProps: { id: row.id, row: row, routePath: this.routePath }
      });
      // console.log("test", { id: row.id, row: row, routePath: this.routePath });
      modal.onDidDismiss()
        .then(() => {
          this.loadData();
          if (this.routePath == '/warehouses') {
            this.warehouseService
              .init()
              .then((data: Observable<HttpResponse<any>>) => {
                data.subscribe((res: HttpResponse<any>) => {
                  // Load of main warehouse in memory
                  this.warehouseService.idWarehouseMain = res.body.data.id;
                });
              });
          }
        });

      return await modal.present();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: UserModel.User | RolModel.Rol) =>
        this.selection.select(row)
      );

    this.isAllSelected()
      ? (this.showDeleteButton = true)
      : (this.showDeleteButton = false);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserModel.User | RolModel.Rol): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
      } row ${row.id + 1}`;
  }

  checkSelection(row?: UserModel.User | RolModel.Rol) {
    this.selection.toggle(row);
    if (this.selection.selected.length > 0) {
      this.showDeleteButton = true;
    } else {
      this.showDeleteButton = false;
    }
  }

  confirmDelete() {
    if (this.selection.selected.length > 0) {
      switch (this.routePath) {
        case '/jails':
        case '/pallets':
          this.presentJailsDeleteAlert(this.selection);
          break;
        default:
          this.presentUsertDeleteAlert(this.selection);
      }
    }
    // console.log('confirmDelete', this.selection.selected);
  }

  changeWarehouse(event) {
    this.warehouseSelected = event.detail.value;
    this.loadData();
  }

  showWarehouseMaps(event, row) {
    event.stopPropagation();
    this.router.navigate([`/warehouses/halls/${row.id}`]);
  }

  showWarehousePoints(event, row) {
    event.stopPropagation();
    this.router.navigate([`/warehouses/locations/${row.id}`]);
  }

  async print(event, row) {
    event.stopPropagation();
    if ((row && row.reference) || this.selection.selected.length > 0) {
      let listReferences: string[] = null;
      if (row && row.reference) {
        listReferences = [row.reference];
      } else if (this.selection.selected.length > 0) {
        listReferences = this.selection.selected.map((selection) => {
          return (<any>selection).reference;
        });
      }

      if ((<any>window).cordova) {
        this.printerService.print({ text: listReferences, type: 0 });
      } else {
        return await this.printerService.printBarcodesOnBrowser(listReferences);
      }
    } else {
      console.debug("Not found reference", row || this.selection.selected);
    }
  }

  async presentUsertDeleteAlert(
    selectedUsers: SelectionModel<UserModel.User | RolModel.Rol>
  ) {
    let header = '';
    let msg = '';
    let successMsg = '';

    if (selectedUsers.selected.length > 1) {
      header = 'Eliminar Usuarios';
      msg = `Estas a punto de eliminar <br>
      <strong>${selectedUsers.selected.length} usuarios</strong>.<br>
      ¿Esta seguro?`;
      successMsg = `${selectedUsers.selected.length} usuarios eliminados`;
    } else {
      header = 'Eliminar Usuario';
      msg = `Estas a punto de eliminar <br> 
      el usuario ${selectedUsers.selected.map(value => value.name.bold())}.<br> 
      ¿Esta seguro? `;
      successMsg = `Usuario ${selectedUsers.selected.map(
        value => value.name
      )} eliminado`;
    }

    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
          }
        },
        {
          text: 'Vale',
          handler: () => {
            this.presentLoading();
            this.crudService
              .deleteDestroy(this.selection.selected, this.apiEndpoint)
              .then(
                (
                  data: Observable<HttpResponse<UserModel.ResponseDestroy>>[]
                ) => {
                  data.map(
                    (
                      response$: Observable<
                        HttpResponse<UserModel.ResponseDestroy>
                      >
                    ) => {
                      response$.subscribe(
                        (response: HttpResponse<UserModel.ResponseDestroy>) => {
                          // // console.log(
                          // `${response.body.data} - ${response.body.code} - ${
                          //   response.body.message
                          //   }`
                          // );
                          this.presentToast(successMsg);
                          this.initUsers();
                          this.dismissLoading();
                        },
                        (errorResponse: HttpErrorResponse) => {
                          this.presentToast(errorResponse.message);
                          // console.log(errorResponse);
                          this.dismissLoading();
                          this.initUsers();
                        }
                      );
                    }
                  );
                }
              );
          }
        }
      ]
    });

    await alert.present();
  }

  async presentJailsDeleteAlert(
    selectedJails: SelectionModel<JailModel.Jail>
  ) {
    let header = '';
    let msg = '';
    let successMsg = '';

    if (selectedJails.selected.length > 1) {
      header = 'Eliminar referencia';
      msg = `Estas a punto de eliminar <br>
      <strong>${selectedJails.selected.length} referencias</strong>.<br>
      ¿Esta seguro?`;
      successMsg = `${selectedJails.selected.length} referencias eliminadas`;
    } else {
      header = 'Eliminar Referencia';
      msg = `Estas a punto de eliminar <br> 
      la referencia ${selectedJails.selected.map(value => value.reference.bold())}.<br> 
      ¿Esta seguro? `;
      successMsg = `Referencia ${selectedJails.selected.map(
        value => value.reference
      )} eliminada`;
    }




    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            // console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Vale',
          handler: () => {
            // console.log('Confirm Okay');
            this.presentLoading();
            this.crudService
              .deleteDestroy(this.selection.selected, this.apiEndpoint)
              .then(
                (
                  data: Observable<HttpResponse<JailModel.ResponseDestroy>>[]
                ) => {
                  data.map(
                    (
                      response$: Observable<
                        HttpResponse<JailModel.ResponseDestroy>
                      >
                    ) => {
                      response$.subscribe(
                        (response: HttpResponse<JailModel.ResponseDestroy>) => {

                          // console.log(
                          //   `${response.body.data} - ${response.body.code} - ${
                          //   response.body.message
                          //   }`
                          // );
                          this.presentToast(successMsg);
                          this.initUsers();
                          this.dismissLoading();
                        },
                        (errorResponse: HttpErrorResponse) => {
                          this.presentToast(errorResponse.message);
                          // console.log(errorResponse);
                          this.dismissLoading();
                          this.initUsers();
                        }
                      );
                    }
                  );
                }
              );
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 2750
    });
    toast.present();
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: 'Un momento ...'
      })
      .then(a => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => { });
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => { });
  }
}
