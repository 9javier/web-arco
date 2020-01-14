import { Component, OnInit } from '@angular/core';
import { AuditsService, IntermediaryService } from '@suite/services';
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
    private intermediaryService : IntermediaryService,
    private router : Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getAllAudits();
  }

  getAllAudits(){
    this.audit.getAllPendintPacking().subscribe(res =>{
      this.Auditories = res.data;
    },err =>{
      this.intermediaryService.presentToastError(err.error.result.reason);
    })
  }

  SeeProducts(data){
    this.router.navigateByUrl('/audits/list-products/'+data.id+'/'+data.packing.reference+'/true');
  }

  OpenAudits(data){
    this.router.navigateByUrl('/audits/scanner-product/'+data.id+'/'+data.packing.reference+'/'+this.activeRoute.snapshot.routeConfig.path)
  }

  restartAudit(audit) {
    this.router.navigateByUrl('/audits/scanner-product/'+audit.id+'/'+audit.packing.reference+'/'+this.activeRoute.snapshot.routeConfig.path);
  }
}
