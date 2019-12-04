import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PickingParametrizationProvider } from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import { Events } from "@ionic/angular";
import { WorkwaveModel } from "../../../../services/src/models/endpoints/Workwaves";
import { WorkwavesService } from 'libs/services/src/lib/endpoint/workwaves/workwaves.service';
import AssignationsByRequests = WorkwaveModel.AssignationsByRequests;

@Component({
  selector: 'table-team-assignation',
  templateUrl: './table-team-assignation.component.html',
  styleUrls: ['./table-team-assignation.component.scss']
})
export class TableTeamAssignationComponent implements OnInit {

  @Output() updateUserAssignations = new EventEmitter();
  @Input() responseQuantities: WorkwaveModel.AssignationsByRequests[];

  private TEAM_ASSIGNATIONS_LOADED = "team-assignations-loaded";
  private BLOCK_BUTTONS_TEAM = 'block_button_team';
  private ENABLED_BUTTONS_TEAM = 'enabled_button_team';

  listTeamAssignations: Array<WorkwaveModel.TeamAssignations> = new Array<WorkwaveModel.TeamAssignations>();

  private maxQuantityAssignations: number = 0;
  maxSizeForCols: number = 12;
  maxSizeForNameCol: number = 2;
  private columnsMultiple: number = 10;

  tooltipValue: string = null;
  enlarged = false;
  public buttonAvailability: boolean = false;
  constructor(
    public events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider,
    private serviceG: WorkwavesService
  ) {

  }

  ngOnInit() {

    this.events.subscribe(this.ENABLED_BUTTONS_TEAM, () => { this.buttonAvailability = true });
    this.events.subscribe(this.BLOCK_BUTTONS_TEAM, () => { this.buttonAvailability = false });
    this.events.subscribe(this.TEAM_ASSIGNATIONS_LOADED, () => {
      this.listTeamAssignations = this.pickingParametrizationProvider.listTeamAssignations;

      this.maxQuantityAssignations = 0;

      if (this.listTeamAssignations.length > 0) {
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
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.TEAM_ASSIGNATIONS_LOADED);
    this.events.unsubscribe(this.BLOCK_BUTTONS_TEAM);
    this.events.unsubscribe(this.ENABLED_BUTTONS_TEAM);

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

  userSelected() {
    this.updateUserAssignations.next();
  }

  showConsolidatedBreakdown(teamAssignation: WorkwaveModel.TeamAssignations) {
    let pickingId: number = teamAssignation.pickingShoes[0].pickingId;
    let assignations: AssignationsByRequests[] = [];
    for(let assignationsByRequests of this.responseQuantities){
      if(assignationsByRequests.pickingId == pickingId){
        assignations.push(assignationsByRequests);
      }
    }
    let destinyIdQuantities: number[] = [];
    for(let assignation of assignations){
      if(typeof destinyIdQuantities[assignation.destinyShopId] == 'number') {
        destinyIdQuantities[assignation.destinyShopId] += parseInt(assignation.quantityShoes);
      }else{
        destinyIdQuantities[assignation.destinyShopId] = parseInt(assignation.quantityShoes);
      }
    }
    let destinyNameQuantities: number[] = [];
    for(let group of this.pickingParametrizationProvider.listGroupsWarehouses){
      for(let warehouse of group.warehouses){
        for(let destinyId in destinyIdQuantities){
          if(parseInt(destinyId) == warehouse.id){
            destinyNameQuantities[warehouse.name] = destinyIdQuantities[destinyId];
          }
        }
      }
    }
    this.tooltipValue = '';
    for(let destinyName in destinyNameQuantities){
      this.tooltipValue += destinyName + ' -> ' + destinyNameQuantities[destinyName] + '\n';
    }
  }

  isChecked(operation: HTMLElement) {
    return operation.children[0].children[0].children[0].children[0].children[0].getAttribute('aria-checked') == 'true';
  }

  getLaunchPairs(operation: HTMLElement) {
    return parseInt(operation.children[0].children[8].children[0].children[0].innerHTML);
  }

  getDestiny(operation: HTMLElement) {
    return operation.children[0].children[4].children[0].children[0].innerHTML;
  }

  isAssigned(operation: HTMLElement, requestReferences){
    return requestReferences.includes(parseInt(operation.children[0].children[1].children[0].children[0].innerHTML));
  }

  enlarge() {
    if (this.enlarged) {
      let top = document.getElementsByClassName('stores-employees')[0] as HTMLElement;
      let middle = document.getElementsByClassName('requests-orders')[0] as HTMLElement;
      let bottom = document.getElementsByClassName('team-assignation')[0] as HTMLElement;
      let empty = document.getElementsByClassName('empty-list')[0] as HTMLElement;
      document.getElementById('top').style.display = 'block';
      top.style.display = 'block';
      middle.style.display = 'block';
      bottom.style.height = 'calc(45vh - 52px - 56px - 18px - 18px - 8px)';
      this.enlarged = !this.enlarged;
    } else {
      let top = document.getElementsByClassName('stores-employees')[0] as HTMLElement;
      let middle = document.getElementsByClassName('requests-orders')[0] as HTMLElement;
      let bottom = document.getElementsByClassName('team-assignation')[0] as HTMLElement;
      let empty = document.getElementsByClassName('empty-list')[0] as HTMLElement;
      document.getElementById('top').style.display = 'none';
      top.style.display = 'none';
      middle.style.display = 'none';
      bottom.style.height = 'calc(100vh - 52px - 56px)';
      this.enlarged = !this.enlarged;
    }
  }

  userAssignationsAreLoading() : boolean {
    return this.pickingParametrizationProvider.loadingListTeamAssignations && this.pickingParametrizationProvider.loadingListTeamAssignations > 0;
  }

}
