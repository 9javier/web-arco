import {Component, Input, OnInit} from '@angular/core';
import {TypeUsersProcesses, UserProcessesService} from "@suite/services";
import {PickingModel} from "../../../../services/src/models/endpoints/Picking";
import {PickingService} from "../../../../services/src/lib/endpoint/picking/picking.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'list-user-assignment-template',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListUserAssignmentTemplateComponent implements OnInit {

  @Input() workwaveId: number = 1;
  public pickingAssignments: PickingModel.Picking[] = [];
  public usersPicking: TypeUsersProcesses.UsersProcesses[] = [];

  constructor(
    private userProcessesService: UserProcessesService,
    private pickingService: PickingService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // TODO enable this to use endpoint data
    this.pickingService
      .getShow(this.workwaveId)
      .subscribe((res: PickingModel.ResponseShow) => {
        if (res.code == 200 || res.code == 201) {
          this.pickingAssignments = res.data;
        } else {

        }
      }, (error: PickingModel.ErrorResponse) => {

      });

    // TODO remove this when enable endpoint data
    /*this.pickingAssignments = [
      {
        store: 'KRACK Vigo',
        typeId: 1,
        quantity: 300,
        threshold: 450
      },
      {
        store: 'KRACK Pontevedra',
        typeId: 1,
        quantity: 350,
        threshold: 500
      },
      {
        store: 'KRACK Lugo',
        typeId: 2,
        quantity: 250,
        threshold: 500
      }
    ];*/

    this.userProcessesService
      .getIndex()
      .subscribe((res: Array<TypeUsersProcesses.UsersProcesses>) => {
        this.usersPicking = res.filter((user: TypeUsersProcesses.UsersProcesses) => {
          let userHasPicking = false;
          for (let process of user.processes) {
            if (process.processType == 5) {
              userHasPicking = true;
            }
          }
          return userHasPicking;
        });
      })
  }

  async savePicking() {
    for (let assignment of this.pickingAssignments) {
      if (!assignment.operator) {
        const alert = await this.alertController.create({
          subHeader: 'Atención',
          message: 'Hay algunas tiendas para el picking en proceso para las que no se ha seleccionado ningún operario. Seleccione alguno antes de continuar.',
          buttons: ['Cerrar']
        });
        return await alert.present();
      }
    }

    this.pickingService
      .putUpdate(this.workwaveId, this.pickingAssignments)
      .subscribe((res: PickingModel.ResponseUpdate) => {
        if (res.code == 200 || res.code == 201) {

        } else {

        }
      }, (error: PickingModel.ErrorResponse) => {

      });
  }

}
