import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';
import { PredistributionModel } from '../../../services/src/models/endpoints/Predistribution';
import Predistribution = PredistributionModel.Predistribution;

@Component({
  selector: 'suite-predistributions',
  templateUrl: './predistributions.component.html',
  styleUrls: ['./predistributions.component.scss'],
})
export class PredistributionsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'article', 'store', 'date_service', 'distribution', 'reserved'];
  dataSource;
  selection = new SelectionModel<Predistribution>(true, []);
  selectionPredistribution = new SelectionModel<Predistribution>(true, []);
  selectionReserved = new SelectionModel<Predistribution>(true, []);

  constructor(private predistributionsService: PredistributionsService) {
    this.predistributionsService.getIndex().then((ELEMENT_DATA) => {
      console.log(ELEMENT_DATA);
      this.dataSource = new MatTableDataSource<Predistribution>(ELEMENT_DATA);
    });
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Ver';
    this.paginator._intl.getRangeLabel = this.getRangeLabel;
    this.dataSource.data.forEach(row => {
      if (row.distribution) {
        this.selectionPredistribution.select(row);
      }

      if (row.reserved) {
        this.selectionReserved.select(row);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    return `${length} resultados / pág. ${page + 1} de ${Math.ceil(length / pageSize)}`;
  };

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelectedPredistribution() {
    let result = true;

    this.dataSource.data.forEach(row => {
      if (row && !row.distribution) {
        result = false;
      }
    });

    return result;
  }

  isAllSelectedReserved() {
    let result = true;
    this.dataSource.data.forEach(row => {
      if (row && !row.reserved) {
        result = false;
      }
    });

    return result;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  predistributionToggle() {
    if (this.isAllSelectedPredistribution()) {
      this.dataSource.data.forEach(row => {
        row.distribution = false;
        this.selectionPredistribution.clear();
      })
    } else {
      this.dataSource.data.forEach(row => {
        row.distribution = true;
        this.selectionPredistribution.select(row);
        row.reserved = false;
        this.selectionReserved.clear();
      });
    }
  }

  reservedToggle() {
    if (this.isAllSelectedReserved()) {
      this.dataSource.data.forEach(row => {
        row.reserved = false;
        this.selectionReserved.clear();
      });
    } else {
      this.dataSource.data.forEach(row => {
        row.reserved = true;
        this.selectionReserved.select(row);
        row.distribution = false;
        this.selectionPredistribution.clear();
      });
    }
  }

  checkboxLabel(row?: Predistribution): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  checkboxLabelPredistribution(row?: Predistribution): string {
    if (!row) {
      return `${this.isAllSelectedPredistribution() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionPredistribution.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  checkboxLabelReserved(row?: Predistribution): string {
    if (!row) {
      return `${this.isAllSelectedReserved() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionReserved.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  changePredistribution(row: Predistribution) {
    if (this.selectionPredistribution.isSelected(row)) {
      this.selectionReserved.deselect(row);
    }

    this.dataSource.data.forEach(dataRow => {
      if (dataRow && dataRow.id === row.id) {
        if (dataRow.distribution) {
          dataRow.distribution = false;
        } else {
          dataRow.distribution = true;
          dataRow.reserved = false;
        }
      }
    });
  }

  changeReserved(row: Predistribution) {
    if (this.selectionReserved.isSelected(row)) {
      this.selectionPredistribution.deselect(row);
    }

    this.dataSource.data.forEach(dataRow => {
      if (dataRow && dataRow.id === row.id) {
        if (dataRow.reserved) {
          dataRow.reserved = false;
        } else {
          dataRow.reserved = true;
          dataRow.distribution = false;
        }
      }
    });
  }

  savePredistributions() {

  }
}
