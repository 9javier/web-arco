import {Component, OnInit} from '@angular/core';
import {Router } from '@angular/router';
import * as toolbarProvider from "../../../services/src/providers/toolbar/toolbar.provider";


@Component({
  selector: 'app-seal-packing-manual',
  templateUrl: './seal-packing-manual.component.html',
  styleUrls: ['./seal-packing-manual.component.scss']
})

export class SealPackingManualComponent implements OnInit {

  constructor(
    private toolbarProvider: toolbarProvider.ToolbarProvider,
    private router: Router
  ) {}

  ngOnInit() {

  }
  /*return to picking task */
  returnSealPacking(){
    this.router.navigate(['/packing/seal/manual']);
    this.toolbarProvider.currentPage.next("Precintar embalaje");
  }

}
