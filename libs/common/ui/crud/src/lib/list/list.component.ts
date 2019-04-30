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
import { UserModel, RolModel } from '@suite/services';
import { CrudService } from '../service/crud.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter, last, take, distinctUntilChanged } from 'rxjs/operators';
import {
  AlertController,
  ToastController,
  ModalController,
  LoadingController
} from '@ionic/angular';

import {StoreComponent as storeUser} from "../../../../../../../apps/sga/src/app/users/store/store.component";
import {StoreComponent as storeRol} from "../../../../../../../apps/sga/src/app/roles/store/store.component";
import {StoreComponent as storeHall} from "../../../../../../../apps/sga/src/app/halls/store/store.component";
import {UpdateComponent as updateUser} from "../../../../../../../apps/sga/src/app/users/update/update.component";
import {UpdateComponent as updateRol} from "../../../../../../../apps/sga/src/app/roles/update/update.component";
import {UpdateComponent as updateHall} from "../../../../../../../apps/sga/src/app/halls/update/update.component";
import {HallsService} from "../../../../../../services/src/lib/endpoint/halls/halls.service";
import {HallModel} from "../../../../../../services/src/models/endpoints/Hall";

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
    private hallsService: HallsService

  ) {
    console.log(this.dataSource);
    console.log('LIST COMPONENT');
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

  // Presentation Layer
  dataSource: any[] = [];
  selection = new SelectionModel<UserModel.User | RolModel.Rol>(true, []);
  navStart: Observable<NavigationStart>;
  routerTo: string;

  showDeleteButton = false;
  isLoading = false;

  ngOnInit() {
    if (this.routePath == '/roles' || this.routePath == '/users') {
      this.initUsers();
    } else if (this.routePath == '/halls') {
      this.initHalls();
    }
  }

  initHalls() {
    this.hallsService
      .getIndex(1)
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
              console.debug('Test::Data -> ', this.dataSource);
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
              console.log(this.dataSource);
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

  async goToStore() {
    let storeComponent = null;

    if (this.routePath == '/roles') {
      storeComponent = storeRol;
    } else if (this.routePath == '/users') {
      storeComponent = storeUser;
    } else if (this.routePath == '/halls') {
      storeComponent = storeHall;
    }

    if (storeComponent) {
      const modal = await this.modalController.create({
        component: storeComponent,
        componentProps: { routePath: this.routePath }
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
    }

    if (updateComponent) {
      const modal = await this.modalController.create({
        component: updateComponent,
        componentProps: { id: row.id, row: row, routePath: this.routePath }
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
      this.presentUsertDeleteAlert(this.selection);
    }
    console.log('confirmDelete', this.selection.selected);
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
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Vale',
          handler: () => {
            console.log('Confirm Okay');
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
                          console.log(
                            `${response.body.data} - ${response.body.code} - ${
                              response.body.message
                            }`
                          );
                          this.presentToast(successMsg);
                          this.initUsers();
                          this.dismissLoading();
                        },
                        (errorResponse: HttpErrorResponse) => {
                          this.presentToast(errorResponse.message);
                          console.log(errorResponse);
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
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }
}
