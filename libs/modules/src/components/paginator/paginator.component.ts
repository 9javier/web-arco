import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, ChangeDetectorRef, Output } from '@angular/core';
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export declare class PageEventPaginator {
  /** The current page index. */
  pageIndex: number;
  /**
   * Index of the page that was selected previously.
   * @breaking-change 8.0.0 To be made into a required property.
   */
  previousPageIndex?: number;
  /** The current page size */
  pageSize: number;
  /** The current total number of items being paged */
  length: number;
}

@Component({
  selector: 'suite-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaginatorComponent implements OnInit {

  @Input() pagerValues: any[];
  @Output() page = new EventEmitter<PageEventPaginator>();

  public openPanel: boolean = false;
  public cantSelect: number;

  pageIndex: number = 1;
  length: number = 0;
  lastPage: number = 1;

  constructor(private changeDetectorRef: ChangeDetectorRef) { 
  }

  ngOnInit() {
    this.cantSelect = this.pagerValues[0];
  }

  defaultClick() {
    this.openPanel = false;
  }

  setOpenPanel(event){
    event.stopPropagation();
    this.openPanel = !this.openPanel;
  }

  changePageSize(event, cant: number): void{
    event.stopPropagation();
    this.cantSelect = cant;
    this.openPanel = false;
    this._emitChanges();
  }

  nextPage(event): void{
    event.stopPropagation();
    if((this.pageIndex+1) <= this.lastPage){
      this.pageIndex ++;
      this._emitChanges();
    }
  }

  previousPage(event): void{
    event.stopPropagation();
    if((this.pageIndex-1) > 0){
      this.pageIndex --;
      this._emitChanges();
    }
  }

  _emitChanges(){
    this.page.emit({"pageIndex": this.pageIndex, "pageSize": this.cantSelect, "length": this.length});
  }

}
