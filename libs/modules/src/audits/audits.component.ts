import { Component, OnInit , ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AuditsService } from '@suite/services';
import { MatSort, MatDialog } from '@angular/material';
import { ToastController } from '@ionic/angular';
import { ProductsByAuditComponent } from './modals/products-by-audit/products-by-audit.component';


export interface Audits {
  user: string;
  status: number;
  packingId: number;
  products: any;
}

const ELEMENT_DATA: Audits[] = [];

@Component({
  selector: 'suite-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit {

  displayedColumns: string[] = ['user', 'status', 'packingId','products','options'];
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
      console.log(err);
    })
  }

  openProducts(data): void {
    const dialogRef = this.dialog.open(ProductsByAuditComponent, {
      width: '600px',
      panelClass: 'config-modal',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
  
    });
  }

  showProducts(item){
    this.audit.getById(item.id).subscribe(res=>{
      if(res.data.sorterAuditPackingProducts.length === 0) this.presentToast('La auditoria seleccionada, no posee Productos','warning');
      if(res.data.sorterAuditPackingProducts.length !== 0) this.openProducts(res.data.sorterAuditPackingProducts)
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
