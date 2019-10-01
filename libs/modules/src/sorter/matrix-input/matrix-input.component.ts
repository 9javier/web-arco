import {Component, Input, OnInit} from '@angular/core';
import {MatrixSorterModel} from "../../../../services/src/models/endpoints/MatrixSorter";
import {ZoneSorterModel} from "../../../../services/src/models/endpoints/ZoneSorter";

@Component({
  selector: 'sorter-matrix-input',
  templateUrl: './matrix-input.component.html',
  styleUrls: ['./matrix-input.component.scss']
})
export class MatrixInputSorterComponent implements OnInit {

  @Input() sorterTemplateMatrix: MatrixSorterModel.MatrixTemplateSorter[] = [];
  private listZonesWithColors: ZoneSorterModel.ZoneColor[] = [];
  private listColors: string[] = [];

  constructor() { }
  
  ngOnInit() {
    this.listColors = [
      '#b388ff',
      '#ccff90',
      '#ff9e80',
      '#ea80fc',
      '#a7ffeb',
      '#ffd180',
      '#82b1ff',
      '#ffe57f',
      '#ff80ab',
      '#f4ff81',
      '#b9f6ca',
      '#8c9eff',
      '#84ffff',
      '#ffff8d',
      '#ff8a80',
      '#80d8ff',
  ];
    let savedIds: any = {};

    let iColorToZone = 0;
    for (let template of this.sorterTemplateMatrix) {
      for (let column of template.columns) {
        if (column.way && column.way.templateZone) {
          let zone = column.way.templateZone;
          if (!savedIds[zone.zones.id]) {
            savedIds[zone.zones.id] = 'ok';
            this.listZonesWithColors.push({
              id: zone.zones.id,
              name: zone.zones.name,
              active: zone.zones.active,
              color: this.listColors[iColorToZone]
            });
            iColorToZone++;
          }
        }
      }
    }
  }

  getBackgroundForSelected(column: MatrixSorterModel.Column) {
    if (column.way && column.way.templateZone){
      let zoneColor = this.listZonesWithColors.find(zone => zone.id == column.way.templateZone.zones.id);
      return zoneColor.color;
    }
    return '#ffffff';
  }
}
