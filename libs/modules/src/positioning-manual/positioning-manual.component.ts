import {Component, OnInit} from '@angular/core';
import {Router } from '@angular/router';
import * as toolbarProvider from "../../../services/src/providers/toolbar/toolbar.provider";


@Component({
  selector: 'app-positioning-manual',
  templateUrl: './positioning-manual.component.html',
  styleUrls: ['./positioning-manual.component.scss']
})

export class PositioningManualComponent implements OnInit {

  constructor(
    private router:Router,
    private toolbarProvider: toolbarProvider.ToolbarProvider
  )
   {}

  ngOnInit() {

  }

  returnMenuPosition(){
    this.router.navigate(['/positioning']);
    this.toolbarProvider.currentPage.next("Ubicar/escanear");
  }

}
