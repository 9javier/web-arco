import { Component, OnInit } from '@angular/core';
import { AuditsService } from '@suite/services';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'suite-pending-revisions',
  templateUrl: './pending-revisions.component.html',
  styleUrls: ['./pending-revisions.component.scss']
})
export class PendingRevisionsComponent implements OnInit {

  public Auditories : any = [];

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    private router : Router,
    private activeRoute: ActivatedRoute
  ) { 
    console.log(this.activeRoute.snapshot.routeConfig.path);
  }

  ngOnInit() {
    this.getAllAudits();
  }

  getAllAudits(){
    this.audit.getAllPendintPacking().subscribe(res =>{
      this.Auditories = res.data;
    },err =>{
      this.presentToast(err.error.result.reason,'danger');
    })
  }

  SeeProducts(data){
    this.router.navigateByUrl('/audits/list-products/'+data.id+'/'+data.packing.reference+'/true');
  }

  OpenAudits(data){
    this.router.navigateByUrl('/audits/scanner-product/'+data.id+'/'+data.packing.reference+'/'+this.activeRoute.snapshot.routeConfig.path)
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
