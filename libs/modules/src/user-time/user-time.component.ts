import { Component, OnInit } from '@angular/core';
import { UserTimeService, IntermediaryService } from '@suite/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'suite-user-time',
  templateUrl: './user-time.component.html',
  styleUrls: ['./user-time.component.scss']
})
export class UserTimeComponent implements OnInit {

  redirect:string;

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
  }

  /**
   * Register user time
   */
  register(force:boolean = false):void{
    this.setUserTime(1);
  }

  /**
   * Set new status of user time
   * @param type - register or stop(1 or 2)
   * @param force - force the solicitude
   */
  setUserTime(type:number,force:boolean = false){
    this.intermediaryService.presentLoading();
    this.userTimeService.registerTime({type,force}).subscribe(()=>{
      setTimeout(()=>{
        this.intermediaryService.presentToastSuccess("Status registrado con éxito");
        this.intermediaryService.dismissLoading();
      },100);
      if(this.redirect)
        this.router.navigate([this.redirect]);
    },()=>{
      setTimeout(()=>{
        this.intermediaryService.dismissLoading();
        this.intermediaryService.presentConfirm("Desea intentar nuevamente",()=>{
          this.intermediaryService.dismissLoading();
          this.intermediaryService.presentToastError("No se pudo registrar con éxito")
          this.setUserTime(type,true);
        });
      },100)
    });
  }

  /**
   * redirect to redirect view
   */
  cancel():void{
    if(this.redirect)
      this.router.navigate([this.redirect]);
  }

  /**
   * Stop user time
   */
  stop(force:boolean = false):void{
    this.setUserTime(2);
  }

}
