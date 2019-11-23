import {Component, OnInit} from '@angular/core';
import {PickingParametrizationProvider} from "../../../../services/src/providers/picking-parametrization/picking-parametrization.provider";
import {Events} from "@ionic/angular";
import {WorkwaveModel} from "../../../../services/src/models/endpoints/Workwaves";

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

  constructor(
    public events: Events,
    public pickingParametrizationProvider: PickingParametrizationProvider
  ) { }

  ngOnInit() {
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
     }
   );
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.TEAM_ASSIGNATIONS_LOADED);
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

}