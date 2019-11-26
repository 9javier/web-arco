import {Component, OnInit} from '@angular/core';
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {Events} from "@ionic/angular";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";
import { WorkwavesService } from 'libs/services/src/lib/endpoint/workwaves/workwaves.service';

@Component({
  selector: 'table-team-assignation',
  templateUrl: './table-team-assignation.component.html',
  styleUrls: ['./table-team-assignation.component.scss']
})
export class TableTeamAssignationOSComponent implements OnInit {

  private TEAM_ASSIGNATIONS_LOADED = "team-assignations-loaded-os";

  listTeamAssignations: Array<WorkwaveModel.TeamAssignations> = new Array<WorkwaveModel.TeamAssignations>();

  private maxQuantityAssignations: number = 0;
  maxSizeForCols: number = 12;
  maxSizeForNameCol: number = 2;
  private columnsMultiple: number = 10;

  tooltipValue: string = null;
  public buttonAvailability : boolean = false;
  enlarged = false;

  constructor(
    public events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider,
    private serviceG : WorkwavesService
  )  {
    this.serviceG.buttonAvailability.subscribe(res=>{
      this.buttonAvailability = res.status;
    })

  }

  ngOnInit() {
   this.events.subscribe(this.TEAM_ASSIGNATIONS_LOADED, () => {
       this.listTeamAssignations = this.pickingParametrizationProvider.listTeamAssignations;

     this.maxQuantityAssignations = 0;

       if (this.listTeamAssignations.length > 0) {
         this.serviceG.buttonAvailability.next({status:true});
         for (let teamAssignation of this.listTeamAssignations) {
           let tempMaxCount = 0;
           for (let assignation of teamAssignation.pickingShoes) {
             tempMaxCount += parseInt(assignation.quantityShoes);
           }
           if (tempMaxCount > this.maxQuantityAssignations) {
             this.maxQuantityAssignations = tempMaxCount;
           }
         }

          this.maxQuantityAssignations *= this.columnsMultiple;

         this.maxSizeForNameCol = this.maxQuantityAssignations * 0.2;
         this.maxSizeForCols = this.maxQuantityAssignations + this.maxSizeForNameCol;
       } else {
         this.maxSizeForCols = 12;
         this.maxSizeForNameCol = 2;
       }
     }
   );
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.TEAM_ASSIGNATIONS_LOADED);
    this.serviceG.buttonAvailability.unsubscribe();
  }

  private teamAssignationsLoaded() {
    this.listTeamAssignations = this.pickingParametrizationProvider.listTeamAssignations;

    for (let teamAssignation of this.listTeamAssignations) {
      let tempMaxCount = 0;
      for (let assignation of teamAssignation.pickingShoes) {
        tempMaxCount += parseInt(assignation.quantityShoes);
      }
      if (tempMaxCount > this.maxQuantityAssignations) {
        this.maxQuantityAssignations = tempMaxCount;
      }
    }

    this.maxSizeForNameCol = this.maxQuantityAssignations * 0.2;
    this.maxSizeForCols = this.maxQuantityAssignations + this.maxSizeForNameCol;
  }

  stringToInt(value: string): number {
    return parseInt(value) * this.columnsMultiple;
  }

  userSelected(){
    let aux = this.serviceG.requestUser.value;
    aux.user = true;
    aux.table = true;
    this.serviceG.requestUser.next(aux);
  }

  showBreakdown() {
    this.tooltipValue = '';

    let selectedOperations = document.getElementsByClassName('requests-orders-line');
    let operationsBreakdown = [];

    for(let i = 0; i < selectedOperations.length; i++){
      let iOperation = selectedOperations[i] as HTMLElement;
      if(this.isChecked(iOperation) && this.getLaunchPairs(iOperation) > 0){
        if(typeof operationsBreakdown[this.getDestiny(iOperation)] != "number") operationsBreakdown[this.getDestiny(iOperation)] = this.getLaunchPairs(iOperation);
        else operationsBreakdown[this.getDestiny(iOperation)] += this.getLaunchPairs(iOperation);
      }
    }

    for(let destiny in operationsBreakdown){
      this.tooltipValue += destiny+' -> '+operationsBreakdown[destiny]+'\n';
    }

    let htmlTooltip = document.getElementsByClassName('mat-tooltip')[0] as HTMLElement;
    htmlTooltip.style.whiteSpace = 'pre';
  }

  isChecked(operation: HTMLElement){
    return operation.children[0].children[0].children[0].children[0].children[0].getAttribute('aria-checked') == 'true';
  }

  getLaunchPairs(operation: HTMLElement){
    return parseInt(operation.children[0].children[8].children[0].children[0].innerHTML);
  }

  getDestiny(operation: HTMLElement){
    return operation.children[0].children[4].children[0].children[0].innerHTML;
  }

  enlarge(){
    if(this.enlarged){
      let top = document.getElementsByClassName('stores-employees')[0] as HTMLElement;
      let middle = document.getElementsByClassName('requests-orders')[0] as HTMLElement;
      let bottom = document.getElementsByClassName('team-assignation')[0] as HTMLElement;
      let empty = document.getElementsByClassName('empty-list')[0] as HTMLElement;
      document.getElementById('top').style.display = 'block';
      top.style.display = 'block';
      middle.style.display = 'block';
      bottom.style.height = 'calc(45vh - 52px - 56px - 8px);';
      if(document.getElementsByClassName('empty-list').length > 0) empty.style.height = 'calc(45vh - 52px - 56px - 8px - 72px)';
      this.enlarged = !this.enlarged;
    }else{
      let top = document.getElementsByClassName('stores-employees')[0] as HTMLElement;
      let middle = document.getElementsByClassName('requests-orders')[0] as HTMLElement;
      let bottom = document.getElementsByClassName('team-assignation')[0] as HTMLElement;
      let empty = document.getElementsByClassName('empty-list')[0] as HTMLElement;
      document.getElementById('top').style.display = 'none';
      top.style.display = 'none';
      middle.style.display = 'none';
      bottom.style.height = 'calc(100vh - 52px - 56px)';
      if(document.getElementsByClassName('empty-list').length > 0) empty.style.height = 'calc(100vh - 52px - 56px - 72px)';
      this.enlarged = !this.enlarged;
    }
  }

}
