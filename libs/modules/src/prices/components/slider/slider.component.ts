import { NavParams, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Range } from '../../interfaces/range.interface';

@Component({
  selector: 'suite-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  priceses: Range;
  minPrices: number;
  maxPrices: number;
  popover: HTMLElement
  constructor(private navParams:NavParams, public popoverController: PopoverController) { }

  ngOnInit() {
  
    const content = document.getElementsByClassName('popover-content')
    content[0].removeAttribute('style')
    content[0].setAttribute('style','left: calc(10px - var(--ion-safe-area-right, 0px));width: 98%;')
    this.popover.lastChild.lastChild
    this.priceses = {
      min: this.navParams.data.params.min,
      max: this.navParams.data.params.max
    }
    this.minPrices = this.navParams.data.values.min;
    this.maxPrices = this.navParams.data.values.max;
    
  }
  rangeChange(event){
    this.minPrices = event.detail.value.lower;
    this.maxPrices =event.detail.value.upper;
  
  }

  async enviar() {
    await this.popoverController.dismiss({min: this.minPrices, max: this.maxPrices})
  }
  
}
