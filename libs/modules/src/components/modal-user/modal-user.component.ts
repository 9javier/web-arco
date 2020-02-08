import { Component, Input, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {FormBuilder} from "@angular/forms";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  @Input() users:any[];

  id_user :number | string;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    console.log(this.users)


  }

  valorId(user:{id:number,name:string,list:number}){
    this.id_user = user.id;
    console.log(this.id_user)
  }

  close():void{
    this.modalController.dismiss();
  }


  enviar(){
    console.log(this.id_user);
    this.close();
  }



}
