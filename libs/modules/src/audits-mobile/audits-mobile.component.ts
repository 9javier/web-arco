import { Component, OnInit } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'suite-audits-mobile',
  templateUrl: './audits-mobile.component.html',
  styleUrls: ['./audits-mobile.component.scss']
})
export class AuditsMobileComponent implements OnInit {

  public Auditories : any = [];

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
  ) { }

  ngOnInit() {
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

}
