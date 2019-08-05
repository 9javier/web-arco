import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-print-prices-manual',
  templateUrl: './print-prices-manual.component.html',
  styleUrls: ['./print-prices-manual.component.scss']
})

export class PrintPricesManualComponent implements OnInit {

  public typeTags: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('type') == 'box') {
      this.typeTags = 1;
    } else {
      this.typeTags = 2;
    }
  }

}
