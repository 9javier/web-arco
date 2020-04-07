import {Component, OnInit} from '@angular/core';
import {Router  } from '@angular/router';
import { ToolbarProvider } from "../../../services/src/providers/toolbar/toolbar.provider";





@Component({
  selector: 'app-print-relabel-product-manual',
  templateUrl: './print-relabel-product-manual.component.html',
  styleUrls: ['./print-relabel-product-manual.component.scss']
})

export class PrintRelabelProductManualComponent implements OnInit {

  constructor(
    private router:Router,
    private toolbarProvider: ToolbarProvider,
  ) {}

  ngOnInit() {
  }
  /**
   * return to menu products
   */
  returnMenuProducts(){
    this.toolbarProvider.currentPage.next("Reetiquetado Productos");
    this.router.navigate(['/positioning/manual']);

  }

}
