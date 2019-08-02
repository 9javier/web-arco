import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {UserTimeService, IntermediaryService, UserTimeModel} from '@suite/services';
import { ActivatedRoute, Router } from '@angular/router';
import UserRegisterTime = UserTimeModel.UserRegisterTime;

@Component({
  selector: 'suite-user-time',
  templateUrl: './user-time.component.html',
  styleUrls: ['./user-time.component.scss']
})
export class UserTimeComponent implements OnInit {

  redirect:string;
  userRegisterTime: UserRegisterTime;

  constructor(
    private route:ActivatedRoute,
    private userTimeService:UserTimeService,
    private intermediaryService:IntermediaryService,
    private router:Router
  ) {
    this.route.paramMap.subscribe(params => {
      this.redirect =  params.get('redirect');
    });
  }

  ngOnInit() {
    this.getUserRegisterTimeActive();
  }

  /**
   * Register user time
   */
  register():void{
    this.setUserTime(1);
  }

  /**
   * Set new status of user time
   * @param type - register or stop(1 or 2)
   */
  setUserTime(type:number){
    const msgSuccess = type == 1 ? "Inicio registro realizado con éxito": "Fin registro realizado con éxito";
    this.intermediaryService.presentLoading();
    this.userTimeService.registerTime({type}).subscribe(()=>{
      setTimeout(()=>{
        this.intermediaryService.presentToastSuccess(msgSuccess);
        this.intermediaryService.dismissLoading();
      },100);
      if(this.redirect && this.redirect == 'logout'){
        this.router.navigate([this.redirect]);
      } else {
        this.getUserRegisterTimeActive();
      }
    },()=>{
      setTimeout(()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentConfirm("Desea intentar nuevamente",()=>{
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError(msgSuccess)
          this.setUserTime(type);
        });
      },100)
    });
  }

  getUserRegisterTimeActive() {
    this.intermediaryService.presentLoading();
    this.userTimeService.userRegisterTime().subscribe((data) => {
      this.intermediaryService.dismissLoading();
      this.userRegisterTime = data;
      if(this.redirect == "logout" && !this.userRegisterTime){
        this.router.navigate([this.redirect]);
      }
    }, (error) => {
      this.intermediaryService.dismissLoading();
      if(this.redirect == "logout" && !this.userRegisterTime){
        this.router.navigate([this.redirect]);
      }
      console.debug("ERROR", error);
    });
  }

  /**
   * redirect to redirect view
   */
  cancel():void{
    if(this.redirect){
      this.router.navigate([this.redirect]);
    }
  }

  /**
   * Stop user time
   */
  stop():void{
    this.setUserTime(2);
  }

  dateInitRegisterTime() : string {
    moment.locale('es');
    return moment(this.userRegisterTime.inputDate).format('DD/MM/YYYY hh:mm:ss');
  }

}
