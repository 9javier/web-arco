import { Component, OnInit , ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {AuditsService, ProductModel, UserModel} from '@suite/services';
import { MatSort, MatDialog } from '@angular/material';
import { ToastController } from '@ionic/angular';
import { ProductsByAuditComponent } from './modals/products-by-audit/products-by-audit.component';
import {CarrierModel} from "../../../services/src/models/endpoints/Carrier";
import {AuditsModel} from "../../../services/src/models/endpoints/Audits";
import AuditPacking = AuditsModel.AuditPacking;


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

  displayedColumns: string[] = ['user', 'status', 'packing','products','options'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ionViewWillEnter(){
    this.getAllAudits();
  }

  constructor(
    private audit : AuditsService,
    private toast : ToastController,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    
  }

  getAllAudits(){
    this.audit.getAll().subscribe(res =>{
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },err =>{
      this.presentToast(err.error.result.reason,'danger');
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
        this.presentToast(`No hay productos escaneados para la auditoría del embalaje ${responseFormatted.packing.reference}`, 'warning');
      } else {
        this.openProducts(responseFormatted);
      }
    })
  }

  async presentToast(message,color) {
    const toast = await this.toast.create({
      message: message,
      color: color,
      duration: 4000
    });
    toast.present();
  }

  applyFilter(event: any) {
    const filteredValue = event.target.value;
    this.dataSource.filter = filteredValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
