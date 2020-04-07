import { Component, OnInit } from '@angular/core';
import { DefectiveManagementService } from '../../../services/src/lib/endpoint/defective-management/defective-management.service';
import { DefectiveManagementModel } from '../../../services/src/models/endpoints/defective-management-model';
import { IntermediaryService } from '@suite/services';
import { AlertController, ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { from, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { UpdateComponent } from './modals/update/update.component';
import { DefectiveManagementChildModel } from '../../../services/src/models/endpoints/DefectiveManagementChild';

@Component({
  selector: 'suite-defective-management',
  templateUrl: './defective-management.component.html',
  styleUrls: ['./defective-management.component.scss'],
})
export class DefectiveManagementComponent implements OnInit {
  openParentId = 0;
  toSelectChildren: (boolean)[] = [];
  toSelectGroup = false;
  groupsToSelect: DefectiveManagementModel.DefectiveManagementParent[] = [];
  groupsChildrenToSelect: DefectiveManagementChildModel.DefectiveManagementChild[] = [];
  groupsDefectiveManagement: DefectiveManagementModel.DefectiveManagementParent[];
  thereAreChanges: boolean;
  groupsDefectiveManagementOriginal: DefectiveManagementModel.DefectiveManagementParent[];

  constructor(
    private defectiveManagementService: DefectiveManagementService,
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.thereAreChanges = false;
    await this.getData();
  }

  async getData() {
    // await this.intermediaryService.presentLoading();
    this.toSelectChildren = [];
    this.groupsChildrenToSelect = [];
    this.defectiveManagementService.getIndex().subscribe((response) => {
      this.groupsDefectiveManagement = response;

      this.groupsDefectiveManagement.forEach((item) => {
        item.deletedChild = false;
        item.updateChild = false;
        item.addedChild = true;
        item.open = item.id === this.openParentId;
      });

      this.groupsDefectiveManagementOriginal = JSON.parse(JSON.stringify(this.groupsDefectiveManagement));
      this.thereAreChanges = false;

      this.intermediaryService.dismissLoading();
    }, (e) => { }, () => {
      this.intermediaryService.dismissLoading();
    });

  }

  async addDefective() {
    let modal = await this.modalController.create({
      component: StoreComponent,
      componentProps: { isParent: true }
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
          componentProps: { group: groupSelected, isParent: true }
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
      header: 'Advertencia',
      message: `¿Está seguro que desea eliminar los tipos de defectos seleccionados?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Eliminar',
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

  onChanged(positionParent: number, parentId: number, child: DefectiveManagementChildModel.DefectiveManagementChild) {
    let exits: boolean = this.groupsChildrenToSelect.some((childX) => childX.id === child.id);

    child.defectTypeParent = parentId;

    if(!exits) {
      this.groupsChildrenToSelect.push(child);
    } else {
      const indexOf = this.groupsChildrenToSelect.map((childX) => childX.id).indexOf(child.id);
      this.groupsChildrenToSelect.splice(indexOf, 1 );
    }

    this.groupsDefectiveManagement[positionParent].deletedChild = false;
    this.groupsDefectiveManagement[positionParent].updateChild = false;
    this.groupsDefectiveManagement[positionParent].addedChild = true;

    const arrayParents = this.groupsChildrenToSelect.filter((x) => x.defectTypeParent === parentId);

    if (arrayParents.length === 1) {
      this.groupsDefectiveManagement[positionParent].addedChild = false;
      this.groupsDefectiveManagement[positionParent].deletedChild = true;
      this.groupsDefectiveManagement[positionParent].updateChild = true;
    } else if (arrayParents.length > 1) {
      this.groupsDefectiveManagement[positionParent].addedChild = false;
      this.groupsDefectiveManagement[positionParent].deletedChild = true;
    }
  }

  async presentDeleteChildrenAlert(parentId: number) {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: `¿Está seguro que desea eliminar los subtipos de defectos seleccionados?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.removeDefectiveType(parentId);
          }
        }
      ]
    });

    await alert.present();
  }

  async removeDefectiveType(parentId: number) {
    await this.intermediaryService.presentLoading();

    let deletions: Observable<any> = new Observable(observer => observer.next());
    this.groupsChildrenToSelect.forEach(child => {
      if (child.defectTypeParent === parentId) {
        deletions = deletions.pipe(switchMap(() => {
          return (this.defectiveManagementService.deleteChildren(child.id))
        }))
      }
    });

    this.groupsChildrenToSelect = [];

    deletions.subscribe(async () => {
      await this.intermediaryService.dismissLoading();
      await this.getData();
      await this.intermediaryService.presentToastSuccess("Tipos de defectos eliminados con exito");
    }, async () => {
      await this.intermediaryService.dismissLoading();
      await this.getData();
      await this.intermediaryService.presentToastError("No se pudieron eliminar algunos de los tipos de defectos");
    });
  }

  updateDefectiveChild() {
    from(this.groupsChildrenToSelect).pipe(first()).subscribe(async (childSelected) => {
      if (childSelected && childSelected.id) {
        let modal = await this.modalController.create({
          component: UpdateComponent,
          componentProps: { child: childSelected, isParent: false }
        });
        modal.onDidDismiss().then(async () => {
          await this.getData();
          this.groupsChildrenToSelect = [];
        });
        await modal.present();
      } else {
        await this.intermediaryService.presentToastError("Error al actualizar el tipo de defectuoso");
      }
    });
  }

  async addDefectiveChild(parentId: number) {
    let modal = await this.modalController.create({
      component: StoreComponent,
      componentProps: { parentId, isParent: false }
    });
    modal.onDidDismiss().then(async () => {
      await this.getData();
    });
    await modal.present();
  }

  openGroup(parentId: number) {
    this.openParentId = parentId;
  }

  storeChanges(){
    if(!this.thereAreChanges){
      if(JSON.stringify(this.groupsDefectiveManagement) !== JSON.stringify(this.groupsDefectiveManagementOriginal)){
        this.thereAreChanges = true;
      }
    }else{
      if(JSON.stringify(this.groupsDefectiveManagement) === JSON.stringify(this.groupsDefectiveManagementOriginal)){
        this.thereAreChanges = false;
      }
    }
  }

  async saveChanges() {
    let atLeastOneChangeDetected: boolean = false;
    //save
    for (let i = 0; i < this.groupsDefectiveManagement.length; i++) {
      for (let j = 0; j < this.groupsDefectiveManagement[i].defectTypeChild.length; j++) {
        const nChild: any = this.groupsDefectiveManagement[i].defectTypeChild[j];
        const oChild: any = this.groupsDefectiveManagementOriginal[i].defectTypeChild[j];
        if (JSON.stringify(nChild) !== JSON.stringify(oChild)) {
          nChild['defectTypeParent'] = this.groupsDefectiveManagement[i].id;
          await this.defectiveManagementService.newUpdateChild(nChild);
          atLeastOneChangeDetected = true;
        }
      }
    }
    //get data
    await this.getData();
    if(atLeastOneChangeDetected){
      await this.intermediaryService.presentToastSuccess('Cambios guardados con éxito');
    }else{
      await this.intermediaryService.presentToastError('Error: no se han encontrado cambios que guardar.')
    }
  }

}
