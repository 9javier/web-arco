import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";

@Component({
  selector: 'suite-receptions-avelon-app',
  templateUrl: './receptions-avelon-app.component.html',
  styleUrls: ['./receptions-avelon-app.component.scss']
})
export class ReceptionsAvelonAppComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private toolbarProvider: ToolbarProvider
  ) {}

  ngOnInit() {
    this.toolbarProvider.showBackArrow.next(true);
  }

  ngOnDestroy() {
    this.toolbarProvider.showBackArrow.next(false);
  }

  receptionByEan() {
    this.router.navigate(['receptions-avelon', 'app', 'scanner']);
  }

  receptionBySearch() {

  }
}
