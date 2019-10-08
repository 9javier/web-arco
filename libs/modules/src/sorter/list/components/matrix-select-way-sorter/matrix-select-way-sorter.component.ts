import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'suite-matrix-select-way-sorter',
  templateUrl: './matrix-select-way-sorter.component.html',
  styleUrls: ['./matrix-select-way-sorter.component.scss']
})
export class MatrixSelectWaySorterComponent implements OnInit {

  @Input() waysMatrix: any = [];
  public selectWay: any = [{
    height: 0,
    columns: []
  }];
  public zoneSelect: any = {};

  constructor() { 
  }

  ngOnInit() {
    this.waysMatrix.forEach(way => {
      var dataColumns = [];
      console.log(way);
      way.columns.forEach(column => {
        var dataColumn = {
          column: '',
          ways_number: '',
          zone: '',
          color: ''
        };
        dataColumn.column = column.column;
        dataColumn.ways_number = column.ways_number;
        if(column.way.templateZone !== null){
          dataColumn.zone = column.way.templateZone.zones.id;
          dataColumn.color = column.way.templateZone.zones.color.hex;
        } else {
          dataColumn.zone = '';
          dataColumn.color = '';
        }
        dataColumns.push(dataColumn);
      });
      console.log(dataColumns);
      this.selectWay.push({
        height: way.height,
        columns: dataColumns
      })
    });
  }

  getColumn(waySelect): void {
    if(this.zoneSelect !== {}){
      this.selectWay.forEach(way => {
        way.columns.forEach(column => {
          if(column.ways_number === waySelect.ways_number){
            column.zone = this.zoneSelect.id;
            column.color = this.zoneSelect.color.hex;
          }
        });
      });
    }
  }

  changeZone(element){
    this.zoneSelect = element;
  }

}
