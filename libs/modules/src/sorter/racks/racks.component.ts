import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { IntermediaryService } from '@suite/services';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { RackModel } from '../../../../services/src/models/endpoints/rack.model';
import { RackService } from '../../../../services/src/lib/endpoint/rack/rack.service';
import { StoreUpdateComponent } from './store-update/store-update.component';

@Component({
  selector: 'suite-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.scss'],
})
export class RacksComponent implements OnInit {
  public title = 'Estantes';
  dataSource: MatTableDataSource<RackModel.Rack>;
  displayedColumns: string[] = ['select', 'name', 'reference', 'warehouse', 'belongWarehouse'];
  selection = new SelectionModel<RackModel.Rack>(true, []);
  showDeleteButton = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private intermediaryService: IntermediaryService,
    private rackService: RackService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.getRacks();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

    this.isAllSelected()
      ? (this.showDeleteButton = true)
      : (this.showDeleteButton = false);
  }

  checkboxLabel(row?: RackModel.Rack): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  checkSelection(row?: RackModel.Rack) {
    this.selection.toggle(row);
    this.showDeleteButton = this.selection.selected.length > 0;
  }

  private async getRacks() {
    await this.intermediaryService.presentLoading();

    await this.rackService.getIndex().then(async ( racks: Observable<HttpResponse<RackModel.ResponseIndex>>) => {
      racks.subscribe(async (res: HttpResponse<RackModel.ResponseIndex>) => {
        this.dataSource = new MatTableDataSource(res.body.data);
        await this.intermediaryService.dismissLoading();
      }, async (err) => {
        console.log(err);
        await this.intermediaryService.dismissLoading();
      }, () => {});
    });
  }

  async confirmDelete() {
    if (this.selection.selected.length > 0) {
      await this.presentDeleteAlert();
    }
  }

  print() {

  }

  async goToDialog() {
    const modal = (await this.modalCtrl.create({
      component: StoreUpdateComponent,
      showBackdrop: true,
      keyboardClose: false,
      backdropDismiss: false,
    }));
    modal.onDidDismiss().then(async () => {
      await this.getRacks();
    });
    modal.present();
  }

  async goToUpdate(row?: RackModel.Rack) {
    this.rackService.populateForm(row);
    await this.goToDialog();
  }

  async presentDeleteAlert() {
    const variant = this.selection.selected.length === 1 ? 'Almacen' : 'Almacenes';
    const variantDelete = this.selection.selected.length === 1 ? 'eliminado' : 'eliminados';
    const header = `Eliminar ${variant}`;
    const message = `¿Seguro que desea eliminar <strong>${this.selection.selected.length}</strong> ${variant}?`;
    const successMsg = `${variant} ${this.selection.selected.map(value => value.name)} ${variantDelete}`;

    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Aceptar',
          handler: async () => {
            await this.intermediaryService.presentLoading();
            await this.deleteElements(successMsg);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteElements(successMsg: string) {
    await this.intermediaryService.presentLoading();
    let observable = new Observable(observer=>observer.next());
    this.selection.selected.forEach(rack => {
      if(rack) {
        observable = observable.pipe(switchMap(resonse =>{
          return this.rackService.delete(rack.id)
        }))
      }
    });

    observable.subscribe(async () => {
      await this.resetTool(successMsg);
    }, async (errorResponse: HttpErrorResponse) => {
      console.log(errorResponse);
      await this.resetTool(errorResponse.message);
    });
  }

  private async resetTool(msg: string) {
    await this.intermediaryService.presentToastSuccess(msg);
    this.selection.clear();
    await this.intermediaryService.dismissLoading();
    await this.getRacks();
    this.showDeleteButton = false;
  }
}
