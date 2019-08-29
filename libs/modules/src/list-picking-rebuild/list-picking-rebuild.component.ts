import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {PickingModel} from "../../../services/src/models/endpoints/Picking";
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PickingService} from "../../../services/src/lib/endpoint/picking/picking.service";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";
import {UserTimeModel, UserTimeService} from "@suite/services";

@Component({
  selector: 'list-picking-rebuild',
  templateUrl: './list-picking-rebuild.component.html',
  styleUrls: ['./list-picking-rebuild.component.scss']
})
export class ListPickingRebuildComponent implements OnInit {

  public STATUS_PICKING_INITIATED: number = 2;

  private idWorkwave: number = null;

  public listPickings: Array<PickingModel.PendingPickingsSelected> = new Array<PickingModel.PendingPickingsSelected>();
  public isLoadingPickings: boolean = false;
  public previousPage: string = '';
  public usersNoSelectedToChangeUser: boolean = true;
  public usersNoSelectedToDelete: boolean = true;
  private listIdsPickingsSelected: Array<number> = new Array<number>();
  private quantityPickingsSelectedAndInitiated: number = 0;
  private loading: HTMLIonLoadingElement = null;
  private listEmployeesToChange: UserTimeModel.ListUsersRegisterTimeActiveInactive = { usersActive: [], usersInactive: [] };

  public deleteOptionEnabled: boolean = true;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private workwavesService: WorkwavesService,
    private pickingService: PickingService,
    private userTimeService: UserTimeService
  ) {}

  ngOnInit() {
    this.idWorkwave = this.activatedRoute.snapshot.paramMap.get('id') ? parseInt(this.activatedRoute.snapshot.paramMap.get('id')) : null;

    if (this.idWorkwave && this.workwavesService.lastWorkwaveRebuildEdited) {
      this.previousPage = 'Olas de Trabajo';
    } else if (this.idWorkwave && this.workwavesService.lastWorkwaveHistoryQueried) {
      this.previousPage = 'Historial';
    } else {
      this.previousPage = null;
    }
    this.loadPickingsList();
    this.loadEmployees();
  }

  private loadPickingsList() {
    this.isLoadingPickings = true;

    let subscribeResponseListPickings = (res: Array<PickingModel.PendingPickings>) => {
      this.listPickings = res;
      this.isLoadingPickings = false;
    };
    let subscribeErrorListPickings = (error) => {
      console.error('Error::Subscribe:pickingService::getListAllPendingPicking::', error);
      this.listPickings = new Array<PickingModel.PendingPickingsSelected>();
      this.isLoadingPickings = false;
    };

    if (this.idWorkwave) {
      this.pickingService
        .getListPendingPickingByWorkwave(this.idWorkwave)
        .subscribe(subscribeResponseListPickings, subscribeErrorListPickings);
    } else {
      this.pickingService
        .getListAllPendingPicking()
        .subscribe(subscribeResponseListPickings, subscribeErrorListPickings);
    }
  }

  private loadEmployees() {
    this.userTimeService
      .getListUsersRegister()
      .subscribe((res: UserTimeModel.ListUsersRegisterTimeActiveInactive) => {
        this.listEmployeesToChange = res;
      }, (error) => {
        console.error('Error::Subscribe:userTimeService::getListUsersRegister::', error);
        this.listEmployeesToChange = { usersActive: [], usersInactive: [] };
      });
  }

  goPreviousPage() {
    this.location.back();
  }

  async changeUserSelected() {
    if (this.listEmployeesToChange.usersActive.length < 1 && this.listEmployeesToChange.usersInactive.length < 1) {
      this.presentToast('No hay usuarios para cambiar.', 'warning');
      return;
    }

    let allUsers = [];
    allUsers = allUsers.concat(this.listEmployeesToChange.usersActive);
    allUsers = allUsers.concat(this.listEmployeesToChange.usersInactive.map(user => {user.start_time = null; return user;}));

    let inputs: any[] = allUsers.map(user => {
      return {
        name: user.id,
        type: 'radio',
        label: `${user.name} // ${user.start_time ? 'Activo' : 'Inactivo'}`,
        value: user.id
      }
    });

    let alert = await this.alertController.create({
      header: 'Nuevo usuario',
      backdropDismiss: false,
      cssClass: 'custom-alert-change-user',
      inputs: inputs,
      buttons: [
        'Cancelar',
        {
          text: 'Cambiar',
          handler: (data) => {
            if (typeof data == 'undefined' || !data) {
              return false;
            }
            this.showLoading('Cambiando usuarios...').then(() => {
              let listUsersPickings = this.listIdsPickingsSelected.map(id => {
                return { user: { id: data }, id: id };
              });
              this.changeUser(listUsersPickings);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  private changeUser(listUsersPickings: any[]) {
    let subscribeResponseChangeEmployees = (res) => {
      if (this.loading) {
        this.loading.dismiss();
        this.loading = null;
      }
      this.presentToast('Usuarios actualizados correctamente.', 'success');
      this.listIdsPickingsSelected = new Array<number>();
      this.loadPickingsList();
    };
    let subscribeErrorChangeEmployees = (error) => {
      console.error('Error::Subscribe:pickingService::putUpdate::', error);
      if (this.loading) {
        this.loading.dismiss();
        this.loading = null;
      }
      this.presentToast('Ha ocurrido un error al intentar actualizar los usuarios de los picking.', 'danger');
    };

    if (this.idWorkwave) {
      this.pickingService
        .putUpdate(this.idWorkwave, listUsersPickings)
        .subscribe(subscribeResponseChangeEmployees, subscribeErrorChangeEmployees);
    } else {
      this.pickingService
        .putUpdateByPickings(listUsersPickings)
        .subscribe(subscribeResponseChangeEmployees, subscribeErrorChangeEmployees);
    }
  }

  pickingSelected(data) {
    if (data.value) {
      this.listIdsPickingsSelected.push(data.id);
      this.usersNoSelectedToChangeUser = false;
      this.usersNoSelectedToDelete = this.listIdsPickingsSelected.length == 1 && !data.delete;
      if (!data.delete) {
        this.quantityPickingsSelectedAndInitiated++;
      }
    } else {
      this.listIdsPickingsSelected = this.listIdsPickingsSelected.filter((id) => id != data.id);
      if (this.listIdsPickingsSelected.length < 1) {
        this.usersNoSelectedToChangeUser = true;
        this.usersNoSelectedToDelete = true;
      }
      if (!data.delete) {
        this.quantityPickingsSelectedAndInitiated--;
      }
    }
  }

  selectAllPickings() {
    if (this.listIdsPickingsSelected.length == this.listPickings.length) {
      this.usersNoSelectedToChangeUser = true;
      this.usersNoSelectedToDelete = true;
      this.quantityPickingsSelectedAndInitiated = 0;

      for (let picking of this.listPickings) {
        picking.selected = false;
      }

      this.listIdsPickingsSelected = new Array<number>();
    } else {
      this.usersNoSelectedToChangeUser = false;
      this.usersNoSelectedToDelete = false;
      this.quantityPickingsSelectedAndInitiated = 0;

      this.listIdsPickingsSelected = new Array<number>();
      for (let picking of this.listPickings) {
        picking.selected = true;
        this.listIdsPickingsSelected.push(picking.id);
        if (picking.status == this.STATUS_PICKING_INITIATED) {
          this.quantityPickingsSelectedAndInitiated++;
        }
      }
    }
  }

  deletePickingsSelected() {
    if (this.quantityPickingsSelectedAndInitiated > 0) {
      this.presentAlertBeforeDelete();
    } else {
      this.presentAlertConfirmDelete();
    }
  }

  private deletePickings() {
    this.workwavesService
      .postDeletePickings({ pickingsIds: this.listIdsPickingsSelected })
      .subscribe((res: any) => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        this.presentToast('Tareas de picking eliminadas correctamente.', 'success');

        this.loadPickingsList();
        this.loadEmployees();
      }, (error) => {
        console.error('Error::Subscribe:workwavesService::deleteDeletePickings::', error);
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        this.presentToast('Ha ocurrido un error al intentar eliminar los picking seleccionados.', 'danger');
      });
  }

  async presentAlertBeforeDelete() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      message: 'Ha seleccionado al menos un picking que ya ha sido iniciado y que no puede ser eliminado. Desmárquelo para poder continuar con la eliminación.',
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  async presentAlertConfirmDelete() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      message: 'Se eliminará los pickings seleccionados. ¿Continuar con su eliminación?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.showLoading('Eliminando picking...').then(() => this.deletePickings());
          }
        }
      ]
    });

    await alert.present();
  }

  async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }

}
