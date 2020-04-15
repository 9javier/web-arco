import { Component, OnInit } from '@angular/core';
import { DefectiveZonesService } from '../../../services/src/lib/endpoint/defective-zones/defective-zones.service';
import { DefectiveZonesModel } from '../../../services/src/models/endpoints/defective-zones-model';
import { IntermediaryService } from '@suite/services';
import { AlertController, ModalController } from '@ionic/angular';
import { StoreComponent } from './modals/store/store.component';
import { from, Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { UpdateComponent } from './modals/update/update.component';
import { DefectiveZonesChildModel } from '../../../services/src/models/endpoints/DefectiveZonesChild';

@Component({
  selector: 'suite-defective-zones',
  templateUrl: './defective-zones.component.html',
  styleUrls: ['./defective-zones.component.scss'],
})
export class DefectiveZonesComponent implements OnInit {
  openParentId = 0;
  toSelectChildren: (boolean)[] = [];
  toSelectGroup = false;
  groupsToSelect: DefectiveZonesModel.DefectiveZonesParent[] = [];
  groupsChildrenToSelect: DefectiveZonesChildModel.DefectiveZonesChild[] = [];
  groupsDefectiveZones: DefectiveZonesModel.DefectiveZonesParent[];
  thereAreChanges: boolean;
  groupsDefectiveZonesOriginal: DefectiveZonesModel.DefectiveZonesParent[];

  constructor(
    private defectiveZonesService: DefectiveZonesService,
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
    this.defectiveZonesService.getIndex().subscribe((response) => {
      this.groupsDefectiveZones = response;

      this.groupsDefectiveZones.forEach((item) => {
        item.deletedChild = false;
        item.updateChild = false;
        item.addedChild = true;
        item.open = item.id === this.openParentId;
      });

      this.groupsDefectiveZonesOriginal = JSON.parse(JSON.stringify(this.groupsDefectiveZones));
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

  activateDelete(group: DefectiveZonesModel.DefectiveZonesParent) {
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
      message: `¿Está seguro que desea eliminar las zonas seleccionadas?`,
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
        return (this.defectiveZonesService.delete(group.id))
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

  onChanged(positionParent: number, parentId: number, child: DefectiveZonesChildModel.DefectiveZonesChild) {
    let exits: boolean = this.groupsChildrenToSelect.some((childX) => childX.id === child.id);

    child.defectZoneParent = parentId;

    if(!exits) {
      this.groupsChildrenToSelect.push(child);
    } else {
      const indexOf = this.groupsChildrenToSelect.map((childX) => childX.id).indexOf(child.id);
      this.groupsChildrenToSelect.splice(indexOf, 1 );
    }

    this.groupsDefectiveZones[positionParent].deletedChild = false;
    this.groupsDefectiveZones[positionParent].updateChild = false;
    this.groupsDefectiveZones[positionParent].addedChild = true;

    const arrayParents = this.groupsChildrenToSelect.filter((x) => x.defectZoneParent === parentId);

    if (arrayParents.length === 1) {
      this.groupsDefectiveZones[positionParent].addedChild = false;
      this.groupsDefectiveZones[positionParent].deletedChild = true;
      this.groupsDefectiveZones[positionParent].updateChild = true;
    } else if (arrayParents.length > 1) {
      this.groupsDefectiveZones[positionParent].addedChild = false;
      this.groupsDefectiveZones[positionParent].deletedChild = true;
    }
  }

  async presentDeleteChildrenAlert(parentId: number) {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: `¿Está seguro que desea eliminar las subzonas seleccionadas?`,
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
            this.removeDefectiveZone(parentId);
          }
        }
      ]
    });

    await alert.present();
  }

  async removeDefectiveZone(parentId: number) {
    await this.intermediaryService.presentLoading();

    let deletions: Observable<any> = new Observable(observer => observer.next());
    this.groupsChildrenToSelect.forEach(child => {
      if (child.defectZoneParent === parentId) {
        deletions = deletions.pipe(switchMap(() => {
          return (this.defectiveZonesService.deleteChildren(child.id))
        }))
      }
    });

    this.groupsChildrenToSelect = [];

    deletions.subscribe(async () => {
      await this.intermediaryService.dismissLoading();
      await this.getData();
      await this.intermediaryService.presentToastSuccess("Zonas con exito");
    }, async () => {
      await this.intermediaryService.dismissLoading();
      await this.getData();
      await this.intermediaryService.presentToastError("No se pudieron eliminar algunas de las zonas");
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
        await this.intermediaryService.presentToastError("Error al actualizar la zona");
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
      if(JSON.stringify(this.groupsDefectiveZones) !== JSON.stringify(this.groupsDefectiveZonesOriginal)){
        this.thereAreChanges = true;
      }
    }else{
      if(JSON.stringify(this.groupsDefectiveZones) === JSON.stringify(this.groupsDefectiveZonesOriginal)){
        this.thereAreChanges = false;
      }
    }
  }

  async saveChanges() {
    let atLeastOneChangeDetected: boolean = false;
    //save
    for (let i = 0; i < this.groupsDefectiveZones.length; i++) {
      const nParent: any = this.groupsDefectiveZones[i];
      const oParent: any = this.groupsDefectiveZonesOriginal[i];
      if (JSON.stringify(nParent) !== JSON.stringify(oParent)) {
        await this.defectiveZonesService.newUpdate(this.groupsDefectiveZones[i].id , nParent);
        atLeastOneChangeDetected = true;
      }
      for (let j = 0; j < this.groupsDefectiveZones[i].defectZoneChild.length; j++) {
        const nChild: any = this.groupsDefectiveZones[i].defectZoneChild[j];
        const oChild: any = this.groupsDefectiveZonesOriginal[i].defectZoneChild[j];
        if (JSON.stringify(nChild) !== JSON.stringify(oChild)) {
          nChild['defectZoneParent'] = this.groupsDefectiveZones[i].id;
          await this.defectiveZonesService.newUpdateChild(nChild);
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
