import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'suite-table-priorities-sorter',
  templateUrl: './table-priorities-sorter.component.html',
  styleUrls: ['./table-priorities-sorter.component.css']
})
export class TablePrioritiesSorterComponent implements OnInit {

  @Input() data: any[];
  public dataSource: MatTableDataSource<Element>;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
    this.dataSource = new MatTableDataSource<Element>(this.data);
  }

}
