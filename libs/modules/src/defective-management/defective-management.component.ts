import { Component, OnInit } from '@angular/core';
import { DefectiveManagementService } from '../../../services/src/lib/endpoint/defective-management/defective-management.service';
import { DefectiveManagementModel } from '../../../services/src/models/endpoints/defective-management-model';
import { IntermediaryService } from '@suite/services';
import { AlertController, ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { from, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { UpdateComponent } from './modals/update/update.component';

@Component({
  selector: 'suite-defective-management',
  templateUrl: './defective-management.component.html',
  styleUrls: ['./defective-management.component.scss'],
})
export class DefectiveManagementComponent implements OnInit {
  toSelectGroup = false;
  groupsToSelect: DefectiveManagementModel.DefectiveManagementParent[] = [];
  groupsDefectiveManagement: DefectiveManagementModel.DefectiveManagementParent[];

  constructor(
    private defectiveManagementService: DefectiveManagementService,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) { }

  async ngOnInit() {
    await this.getData();
  }

  async getData() {
    // await this.intermediaryService.presentLoading();
    this.defectiveManagementService.getIndex().subscribe((response) => {
      this.groupsDefectiveManagement = response;
      this.intermediaryService.dismissLoading();
    }, (e) => { }, () => {
      this.intermediaryService.dismissLoading();
    });

  }

  async addDefective() {
    let modal = await this.modalController.create({
      component: StoreComponent
    });
    modal.onDidDismiss().then(async () => {
      await this.getData();
    });
    await modal.present();
  }

  activateDelete(group: DefectiveManagementModel.DefectiveManagementParent) {
    this.toSelectGroup = true;
    let exits: boolean = this.groupsToSelect.some((groupX) => groupX.id === group.id);

    if(!exits) {
      this.groupsToSelect.push(group);
    } else {
      const indexOf = this.groupsToSelect.map((groupX) => groupX.id).indexOf(group.id);
      this.groupsToSelect.splice(indexOf, 1 );
    }
    if(this.groupsToSelect.length === 0) {
      this.toSelectGroup = false;
    }
  }

  async updateDefective() {
    from(this.groupsToSelect).pipe(first()).subscribe(async (groupSelected) => {
      if (groupSelected && groupSelected.id) {

        let modal = await this.modalController.create({
          component: UpdateComponent,
          componentProps: { group: groupSelected }
        });
        modal.onDidDismiss().then(async () => {
          await this.getData();
          this.groupsToSelect = [];
          this.toSelectGroup = false;
        });
        await modal.present();
      } else {
        await this.intermediaryService.presentToastError("Error al actualizar el grupo");
      }
    });
  }

  async presentDeleteAlert() {
    const alert = await this.alertController.create({
      header: 'Eliminar Grupos Defectuosos',
      message: `¿Está seguro que desea eliminar los grupos seleccionados?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Vale',
          handler: () => {
            this.removeDefective();
          }
        }
      ]
    });

    await alert.present();
  }

  async removeDefective() {
    await this.intermediaryService.presentLoading();

    let deletions:Observable<any> =new Observable(observer=>observer.next());
    this.groupsToSelect.forEach(group => {
      deletions = deletions.pipe(switchMap(() => {
        return (this.defectiveManagementService.delete(group.id))
      }))
    });

    this.groupsToSelect = [];
    this.toSelectGroup = false;

    deletions.subscribe(async ()=>{
      await this.intermediaryService.dismissLoading();
      await this.getData();
      await this.intermediaryService.presentToastSuccess("Grupos eliminados con exito");
    },async ()=>{
      await this.intermediaryService.dismissLoading();
      await this.getData();
      await this.intermediaryService.presentToastError("No se pudieron eliminar algunos de los grupos");
    });
  }
}
