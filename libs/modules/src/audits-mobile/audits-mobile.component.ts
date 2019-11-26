import { Component, OnInit } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'suite-audits-mobile',
  templateUrl: './audits-mobile.component.html',
  styleUrls: ['./audits-mobile.component.scss']
})
export class AuditsMobileComponent implements OnInit {

  public Auditories : any = [];

  public static returned: Subject<any> = new Subject();

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private toolbarProvider: ToolbarProvider,
    private router : Router
  ) { 
    AuditsMobileComponent.returned.subscribe(res => {
      this.getAllAudits();
    });
  }

  ngOnInit() {
    this.toolbarProvider.currentPage.next('Auditorías');
    this.getAllAudits();
  }

  getAllAudits(){
    this.audit.getAll().subscribe(res =>{
      this.Auditories = res.data;
      console.log(res);
    },err =>{
      this.presentToast(err.error.result.reason,'danger');
    })
  }

  closeAuditoria(data){
    this.audit.create({packingReference:data,status:2}).subscribe(res =>{
      console.log(res);
      this.presentToast('Auditoria Cerrada!!','success');
      this.getAllAudits();
    })
  }

  async presentToast(message,color) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      duration: 4000
    });
    toast.present();
  }

  SeeProducts(data){
    this.router.navigateByUrl('/audits/list-products/'+data.id+'/'+data.packing.reference+'/false');
  }

}
