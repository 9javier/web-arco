import { Component, OnInit, ViewChild } from '@angular/core';
import { IntermediaryService } from '../../../services/src/lib/endpoint/intermediary/intermediary.service';
import { OplTransportsService } from '../../../services/src/lib/endpoint/opl-transports/opl-transports.service';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { OplTransportsModel } from '../../../services/src';
import { OrderPackageComponent } from './order-package/order-package.component';

@Component({
  selector: 'suite-transports-orders',
  templateUrl: './transports-orders.component.html',
  styleUrls: ['./transports-orders.component.scss']
})
export class TransportsOrdersComponent implements OnInit {
  @ViewChild('#tabGroup') private tabGroup: MatTabsModule;
  @ViewChild(OrderPackageComponent) orders: OrderPackageComponent 
  selectedIndex = 0;
  transports: Array<OplTransportsModel.ItemFilter> = []
  indexTab: number;
  constructor(
    private intermediaryService: IntermediaryService,
    private oplTransportsService: OplTransportsService
  ) { }

  ngOnInit() {
    
    this.getTranspor()
  }
  getTranspor(){
    this.oplTransportsService.getTransports().subscribe((resp: OplTransportsModel.OrderExpeditionTransportsFilters) => {
      // console.log(resp);
      this.transports = resp.transports
      console.log(this.transports);
      
    })
  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
    this.indexTab = tabChangeEvent.index;
  }

  refresh() {
    this.orders.refresh();
  }
  
 }
