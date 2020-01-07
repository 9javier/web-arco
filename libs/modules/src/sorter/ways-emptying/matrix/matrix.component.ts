import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Events} from "@ionic/angular";
import {MatrixSorterModel} from "../../../../../services/src/models/endpoints/MatrixSorter";
import {ZoneSorterModel} from "../../../../../services/src/models/endpoints/ZoneSorter";
import {SorterProvider} from "../../../../../services/src/providers/sorter/sorter.provider";

@Component({
  selector: 'sorter-matrix-emptying',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixEmptyingSorterComponent implements OnInit, OnDestroy {

  @Input() enableZoneSelection: boolean = false;
  @Input() sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];
  @Input() height: string = null;
  @Input() width: string = null;
  @Output() columnSelected = new EventEmitter();

  private listZonesWithColors: ZoneSorterModel.ZoneColor[] = [];
  private isTemplateWithEqualZones: boolean = false;

  public waySelected: number = null;
  public waysSelected: any[] = [];

  constructor(
    private events: Events,
    private sorterProvider: SorterProvider
  ) {
    this.sorterProvider.idZoneSelected = null;
  }

  ngOnInit() {
    this.waysSelected = [];
  }

  ngOnDestroy() {

  }

  getBackground(column: MatrixSorterModel.Column) : string {
    if (column && column.way) {
      let way = null;
      let blueWay = false;
      for(way of this.waysSelected){
        if (column.way.id == way.id) {
          blueWay = true;
        }
      }
      if (blueWay == true) {
        return 'lightskyblue';
      } else if (column.way.templateZone && column.way.templateZone.zones && column.way.templateZone.zones.color) {
        return column.way.templateZone.zones.color.hex;
      }
    } else {
      return '#ffffff';
    }
  }

  getBackgroundForSelected(column: MatrixSorterModel.Column) : string {
    if (column && column.way) {
      if (column.way.id == this.waySelected) {
        return 'lightskyblue';
      } else if (column.way.templateZone && column.way.templateZone.zones && column.way.templateZone.zones.color) {
        return column.way.templateZone.zones.color.hex;
      }
    } else {
      return '#ffffff';
    }
  }

  getEmptyingType(column: MatrixSorterModel.Column) : string {
    let emptyingType = '';
    if (column.way.manual == 1) {
      emptyingType = 'VM';
    }

    if (column.way.new_emptying != null && column.way.manual != column.way.new_emptying) {
      if (column.way.new_emptying == 1) {
        emptyingType = 'VM';
      } else {
        emptyingType = '';
      }
    }

    return emptyingType;
  }

  isFromSelectedZone(column: MatrixSorterModel.Column) : boolean {
    if (this.sorterProvider.idZoneSelected) {
      if (column.way && column.way.templateZone && column.way.templateZone.zones && this.sorterProvider.idZoneSelected == column.way.templateZone.zones.id) {
        if (this.sorterProvider.idZoneSelected == column.way.templateZone.zones.id) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  selectWay(column: MatrixSorterModel.Column, iHeight: number, iCol: number) {
    this.waySelected = column.way.id;
    this.waysSelected.push(column.way);
    this.columnSelected.next({column, iHeight, iCol});
  }

  refresh(){
    this.waysSelected = [];
  }

  public loadNewMatrix(newMatrix: MatrixSorterModel.MatrixTemplateSorter[]) {
    this.sorterTemplateMatrix = newMatrix;

    let savedIds: any = {};
    this.listZonesWithColors = [];

    if (this.sorterTemplateMatrix.length > 0 && this.sorterTemplateMatrix[0].columns.length > 0 && this.sorterTemplateMatrix[0].columns[0].way && this.sorterTemplateMatrix[0].columns[0].way.templateZone && this.sorterTemplateMatrix[0].columns[0].way.templateZone.template) {
      this.isTemplateWithEqualZones = this.sorterTemplateMatrix[0].columns[0].way.templateZone.template.equalParts;
    }

    for (let template of this.sorterTemplateMatrix) {
      for (let column of template.columns) {
        if (column.way) {
          if (column.way.templateZone) {
            let zone = column.way.templateZone;
            if (!savedIds[zone.zones.id]) {
              savedIds[zone.zones.id] = 'ok';
              this.listZonesWithColors.push({
                id: zone.zones.id,
                name: zone.zones.name,
                active: zone.zones.active,
                color: zone.zones.color.hex
              });
            }
          }
        }
      }
    }
    if (this.listZonesWithColors.length > 0) {
      if (this.enableZoneSelection && this.isTemplateWithEqualZones) {
        this.listZonesWithColors.unshift({
          id: 0,
          name: 'Zona seleccionada',
          active: true,
          color: '#87CEFA'
        })
      }
    }
  }

  public changeEmptyingForWay(newEmptying: number, iHeight: number, iCol: number) {
    this.sorterTemplateMatrix[iHeight].columns[iCol].way.new_emptying = newEmptying;
  }
}
