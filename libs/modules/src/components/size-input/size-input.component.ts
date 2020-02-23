import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'size-input',
  templateUrl: './size-input.component.html',
  styleUrls: ['./size-input.component.scss']
})
export class SizeInputComponent implements OnInit {

  @Input() item: any = null;

  constructor() { }

  ngOnInit() {

  }

  public selectValue(itemId: number) {
    setTimeout(() => {
      (<any>document.getElementById('input_'+itemId)).setSelectionRange(0, 99999);
    }, 200);
  }
}
