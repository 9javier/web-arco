import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'loading-message',
  templateUrl: './loading-message.component.html',
  styleUrls: ['./loading-message.component.scss'],
  animations: [
    trigger('fadein', [
      state('out', style({ opacity: 0, display: 'none' })),
      transition('in => out', [
        style({ opacity: 1, display: 'block' }),
        animate('300ms ease-out', style({ opacity: 0, display: 'none' }))
      ]),
      transition('out => in', [
        style({ opacity: 0, display: 'none' }),
        animate('1ms ease-out', style({ opacity: 1, display: 'block' }))
      ])
    ])
  ]
})
export class LoadingMessageComponent implements OnInit, OnDestroy {

  @Input() message: string = 'CARGANDO';

  public stateAnimation: string = 'out';

  private showMessage: boolean = false;
  private loops: number = 0;
  private intervalToLoader = null;
  private originalMessage: string = 'CARGANDO';

  constructor() {}

  ngOnInit() {

  }

  ngOnDestroy() {
    this.stopLoading();
  }

  public show(show: boolean, customMessage?: string) {
    this.showMessage = show;
    if (show) {
      if (customMessage) {
        this.message = customMessage;
      } else {
        this.message = this.originalMessage;
      }
      this.stateAnimation = 'in';
      this.startLoading();
    } else {
      this.stateAnimation = 'out';
      this.stopLoading();
    }
  }

  private startLoading() {
    this.originalMessage = this.message;
    this.intervalToLoader = setInterval(() => {
      if (this.loops == 3) {
        this.message = this.originalMessage;
        this.loops = 0;
      } else {
        this.message += '.';
        this.loops++;
      }
    }, 1000);
  }

  private stopLoading() {
    this.loops = 0;
    this.message = this.originalMessage;
    if (this.intervalToLoader) clearInterval(this.intervalToLoader)
  }
}
