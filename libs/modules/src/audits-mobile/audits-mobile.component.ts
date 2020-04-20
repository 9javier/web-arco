import { Component, OnInit } from '@angular/core';
import { AuditsService, IntermediaryService } from '@suite/services';
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {Router, ActivatedRoute} from '@angular/router';
import { Subject } from 'rxjs';
import {AuditMultipleScanditService} from "../../../services/src/lib/scandit/audit-multiple/audit-multiple.service";
import { TimesToastType } from '../../../services/src/models/timesToastType';

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
    private intermediaryService : IntermediaryService,
    private toolbarProvider: ToolbarProvider,
    private router : Router,
    private activeRoute: ActivatedRoute,
    private auditMultipleScanditService: AuditMultipleScanditService
  ) {
    AuditsMobileComponent.returned.subscribe(res => {
      this.getAllAudits();
    });
  }

  ngOnInit() {
    this.toolbarProvider.currentPage.next('Control de embalajes');
    this.getAllAudits();
  }

  getAllAudits(){
    this.audit.getAll().subscribe(res =>{
      this.Auditories = res.data;
    },err =>{
      this.intermediaryService.presentToastError(err.error.result.reason);
    })
  }

  closeAuditoria(data){
    this.audit.create({packingReference:data,status:2}).subscribe(res =>{
      this.intermediaryService.presentToastSuccess('Control de embalaje cerrado!!',TimesToastType.DURATION_SUCCESS_TOAST_3750);
      this.getAllAudits();
    })
  }

  SeeProducts(data){
    this.router.navigateByUrl('/audits/list-products/'+data.id+'/'+data.packing.reference+'/false');
  }

  restartAudit(audit) {
    this.router.navigateByUrl('/audits/scanner-product/'+audit.id+'/'+audit.packing.reference+'/'+this.activeRoute.snapshot.routeConfig.path);
  }

  initAuditMultipleScandit(){
    this.auditMultipleScanditService.init();
  }

  getMessageVerifiedProducts(productsQuantity: number) : string {
    if (productsQuantity === 0 || productsQuantity > 1) {
      return `${productsQuantity} productos verificados`;
    } else {
      return `${productsQuantity} producto verificado`;
    }
  }
}
