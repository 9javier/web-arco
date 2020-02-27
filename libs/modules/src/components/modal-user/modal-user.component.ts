import { Component, Input, OnInit} from '@angular/core';
import { ModalController } from "@ionic/angular";
import { IntermediaryService, UserTimeModel, UserTimeService } from '@suite/services';

@Component({
  selector: 'suite-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {

  @Input() ListReceptions;

  selectedUserId: number = null;
  users: UserTimeModel.PickingsUser[] = [];

  constructor(
    private modalController: ModalController,
    private intermediaryService:IntermediaryService,
    private userTimeService: UserTimeService
  ){}

  async ngOnInit() {
    await this.intermediaryService.presentLoading();
    this.userTimeService.getListUsersRegister().subscribe(response => {
      const activeUsersIds: number[] = [];
      for (let user of response.usersActive) {
        if(!activeUsersIds.includes(user.id)) activeUsersIds.push(user.id);
      }
      for (let user of response.usersInactive) {
        if(!activeUsersIds.includes(user.id)) activeUsersIds.push(user.id);
      }
      this.userTimeService.getUsersShoesPicking(activeUsersIds).subscribe(response => {
        if(response){
          this.users = response;
        }
      }, async error => {
        console.error(error);
        await this.intermediaryService.dismissLoading();
      }, async () => {
        if(this.users.length == 0){
          await this.intermediaryService.presentToastError("No hay usuarios disponibles.");
        }
        await this.intermediaryService.dismissLoading();
      });
    }, async error => {
      console.error(error);
      await this.intermediaryService.dismissLoading();
    });
  }

  async close() {
    await this.modalController.dismiss();
  }

  async send(){
    await this.modalController.dismiss(this.selectedUserId);
  }

}
