import {Component, OnInit, Inject, Optional, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuditsModel} from "../../../../../services/src/models/endpoints/Audits";

const ELEMENT_DATA: AuditsModel.AuditPackingProduct[] = [];

@Component({
  selector: 'suite-products-by-audit',
  templateUrl: './products-by-audit.component.html',
  styleUrls: ['./products-by-audit.component.scss']
})
export class ProductsByAuditComponent implements OnInit {

  displayedColumns: string[] = ['reference', 'name', 'status'];
  dataSource: MatTableDataSource<AuditsModel.AuditPackingProduct> = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ProductsByAuditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AuditsModel.AuditPacking
  ) {
    this.dataSource = new MatTableDataSource(this.data.sorterAuditPackingProducts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  applyFilter(event: any) {
    const filteredValue = event.target.value;
    this.dataSource.filter = filteredValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProductStatusText(product: AuditsModel.AuditPackingProduct) : string {
    if (product.incidence) {
      return 'Con incidencia';
    } else if (product.rightAudit) {
      return 'Validado';
    } else {
      return '-';
    }
  }
}
