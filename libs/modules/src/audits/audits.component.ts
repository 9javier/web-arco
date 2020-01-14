import { Component, OnInit , ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AuditsService, IntermediaryService } from '@suite/services';
import { MatSort, MatDialog } from '@angular/material';
import { ProductsByAuditComponent } from './modals/products-by-audit/products-by-audit.component';
import {AuditsModel} from "../../../services/src/models/endpoints/Audits";
import AuditPacking = AuditsModel.AuditPacking;
import {DateTimeParserService} from "../../../services/src/lib/date-time-parser/date-time-parser.service";


export interface Audits {
  user: string;
  status: number;
  packing: {
    reference: string
  };
  products: any;
}

const ELEMENT_DATA: Audits[] = [];

@Component({
  selector: 'suite-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit {

  displayedColumns: string[] = ['user', 'status', 'packing', 'date-start', 'products','options'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ionViewWillEnter(){
    this.getAllAudits();
  }

  constructor(
    private audit : AuditsService,
    private intermediaryService : IntermediaryService,
    public dialog: MatDialog,
    private dateTimeParserService: DateTimeParserService
  ) { }

  ngOnInit() {

  }

  getAllAudits(){
    this.audit.getAll().subscribe(res =>{
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },err =>{
      this.intermediaryService.presentToastError(err.error.result.reason);
    })
  }

  openProducts(data: AuditPacking): void {
    const dialogRef = this.dialog.open(ProductsByAuditComponent, {
      width: '600px',
      panelClass: 'custom-material-modal',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  showProducts(item) {
    this.audit.getById(item.id).subscribe(res => {
      let responseFormatted: AuditPacking = res.data;
      if (responseFormatted.sorterAuditPackingProducts.length === 0) {
        this.intermediaryService.presentToastWarning(`No hay productos escaneados para la auditoría del embalaje ${responseFormatted.packing.reference}`);
      } else {
        this.openProducts(responseFormatted);
      }
    })
  }

  applyFilter(event: any) {
    const filteredValue = event.target.value;
    this.dataSource.filter = filteredValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDateFormatted(originalDate) : string {
    return this.dateTimeParserService.dateMonthYear(originalDate);
  }
}
