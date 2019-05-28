import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'list-workwaves-history',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListWorkwavesHistoryComponent implements OnInit {

  private workwavesHistory: any[] = [];

  constructor() {}

  ngOnInit() {

  }

}
