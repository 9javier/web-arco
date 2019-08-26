import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {PickingModel} from "../../../services/src/models/endpoints/Picking";
import {WorkwavesService} from "../../../services/src/lib/endpoint/workwaves/workwaves.service";
import {Router} from "@angular/router";
import {PickingService} from "../../../services/src/lib/endpoint/picking/picking.service";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";

@Component({
  selector: 'list-picking-rebuild',
  templateUrl: './list-picking-rebuild.component.html',
  styleUrls: ['./list-picking-rebuild.component.scss']
})
export class ListPickingRebuildComponent implements OnInit {

  public listPickings: Array<PickingModel.PendingPickingByWorkWaveSelected> = new Array<PickingModel.PendingPickingByWorkWaveSelected>();
  public isLoadingPickings: boolean = false;
  public previousPage: string = '';
  public usersNoSelectedToChangeUser: boolean = true;
  public usersNoSelectedToDelete: boolean = true;
  private listIdsPickingsSelected: Array<number> = new Array<number>();
  private quantityPickingsSelectedAndInitiated: number = 0;
  private loading: HTMLIonLoadingElement = null;

  constructor(
    private location: Location,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private workwavesService: WorkwavesService,
    private pickingService: PickingService,
  ) {}

  ngOnInit() {
    if (this.workwavesService.lastWorkwaveRebuildEdited) {
      this.previousPage = 'Olas de Trabajo';
      this.loadPickingsList(this.workwavesService.lastWorkwaveRebuildEdited.id);
    } else if (this.workwavesService.lastWorkwaveHistoryQueried) {
      this.previousPage = 'Historial';
    }
  }

  private loadPickingsList(idWorkWave: number) {
    this.isLoadingPickings = true;
    this.pickingService
      .getListPendingPickingByWorkwave(idWorkWave)
      .subscribe((res: Array<PickingModel.PendingPickingByWorkWaveSelected>) => {
        this.listPickings = res;
        this.isLoadingPickings = false;
      }, (error) => {
        console.error('Error::Subscribe:pickingService::getListPendingPickingByWorkwave::', error);
        this.isLoadingPickings = false;
      });
  }

  goPreviousPage() {
    this.location.back();
  }

  changeUser() {

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

  deletePickingsSelected() {
    if (this.quantityPickingsSelectedAndInitiated > 0) {
      this.presentAlertBeforeDelete();
    } else {
      this.presentAlertConfirmDelete();
    }
  }

  private deletePickings() {
    this.workwavesService
      .deleteDeletePickings({ pickingIds: this.listIdsPickingsSelected })
      .subscribe((res: any) => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
        this.presentToast('Tareas de picking eliminadas correctamente.', 'success');
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
