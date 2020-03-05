import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ToolbarProvider} from "../../../services/src/providers/toolbar/toolbar.provider";
import {ReceptionAvelonProvider} from "../../../services/src/providers/reception-avelon/reception-avelon.provider";

@Component({
  selector: 'suite-receptions-avelon-app',
  templateUrl: './receptions-avelon-app.component.html',
  styleUrls: ['./receptions-avelon-app.component.scss']
})
export class ReceptionsAvelonAppComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private toolbarProvider: ToolbarProvider,
    private receptionAvelonProvider: ReceptionAvelonProvider
  ) {}

  ngOnInit() {
    this.toolbarProvider.currentPage.next('Recepción de mercancía');
  }

  ngOnDestroy() {
    this.receptionAvelonProvider.expeditionData = null;
  }

  receptionBySearch() {
    this.router.navigate(['receptions-avelon', 'app', 'manual']);
  }
}
