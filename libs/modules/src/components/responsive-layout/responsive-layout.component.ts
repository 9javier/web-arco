import { Component, OnInit } from '@angular/core';
import { Observable,fromEvent } from 'rxjs';

@Component({
  selector: 'suite-responsive-layout',
  templateUrl: './responsive-layout.component.html',
  styleUrls: ['./responsive-layout.component.scss']
})
export class ResponsiveLayoutComponent implements OnInit {

  /**it is a simple flag, true is the equivalent to landscape, and false if it is portrait */
  landscape:boolean = window.matchMedia("(orientation: landscape)").matches;

  constructor() { }

  ngOnInit() {
    this.windowEvent();
  }

  /**
   * Using to subscribe to the event and transform it into observable then verify if the screen is in landscape or portrait
   */
  windowEvent():void{
    fromEvent(window,'resize').subscribe(event=>{
      this.landscape = window.matchMedia("(orientation: landscape)").matches;
    });
  }

}
