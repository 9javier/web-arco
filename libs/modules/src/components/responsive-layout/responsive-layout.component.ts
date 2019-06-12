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
  width;
  height;

  constructor() { }

  ngOnInit() {
    this.windowEvent();
    this.width = this.getWidth();
    this.height = this.getHeight();
  }

  /**
   * Using to subscribe to the event and transform it into observable then verify if the screen is in landscape or portrait
   */
  windowEvent():void{
    fromEvent(window,'resize').subscribe(event=>{
      if(!(this.height > this.getHeight() && this.getHeight()!=this.height && this.width == this.getWidth()))
        this.landscape = window.matchMedia("(orientation: landscape)").matches;
      this.width = this.getWidth();
      this.height = this.getHeight();
    });
  }

  /**
   * @returns the actual width of browser
   */
  getWidth():number{
    return window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
  }

  /**
   * @returns the actual height of browser
   */
  getHeight():number{
    return window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
  }

}
