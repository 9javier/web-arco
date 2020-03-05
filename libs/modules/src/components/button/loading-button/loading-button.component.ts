import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss']
})
export class LoadingButtonComponent implements OnInit {

  @Input() label: string = null;
  @Input() labelLoading: string = null;
  @Input() icon: string = null;
  @Input() tooltip: string = null;
  @Output() clickButton = new EventEmitter();

  private _isLoading: boolean = false;
  get isLoading(): boolean {
    return this._isLoading;
  }
  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  private _isDisabled: boolean = true;
  get isDisabled(): boolean {
    return this._isDisabled;
  }
  set isDisabled(value: boolean) {
    this._isDisabled = value;
  }

  constructor() { }

  ngOnInit() {

  }

  public clickBtn(event) {
    this.clickButton.next(event);
  }
}
