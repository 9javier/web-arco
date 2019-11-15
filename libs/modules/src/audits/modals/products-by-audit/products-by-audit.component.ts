import { Component, OnInit, Inject, Optional,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort, MatDialog } from '@angular/material';
import { ToastController } from '@ionic/angular';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface Products {
  name: string;
  reference: number;
  incidence: boolean;
  status: boolean;
}

const ELEMENT_DATA: Products[] = [];

@Component({
  selector: 'suite-products-by-audit',
  templateUrl: './products-by-audit.component.html',
  styleUrls: ['./products-by-audit.component.scss'],
  
})
export class ProductsByAuditComponent implements OnInit {

  displayedColumns: string[] = ['name', 'reference', 'incidence','status'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ProductsByAuditComponent>,
    @Optional ()  @Inject(MAT_DIALOG_DATA) public data: any,
    private toast : ToastController,
    ) {
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.data);
    }

    close(): void {
      this.dialogRef.close();
    }

    ngOnInit() {
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

}
