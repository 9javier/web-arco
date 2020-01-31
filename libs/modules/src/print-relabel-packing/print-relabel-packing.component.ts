import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'suite-print-relabel-packing',
  templateUrl: './print-relabel-packing.component.html',
  styleUrls: ['./print-relabel-packing.component.scss']
})
export class PrintRelabelPackingComponent implements OnInit {

  public isStore: boolean = false;

  constructor(
    public router: Router
  ) {}

  async ngOnInit() {

  }
  
  /**
   * Return Main Packing
   */
  returnMainPacking(){
    this.router.navigate(['/jails/menu']);
  }

}
