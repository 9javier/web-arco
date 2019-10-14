import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePrioritiesSorterComponent } from './table-priorities-sorter.component';

describe('TablePrioritiesSorterComponent', () => {
  let component: TablePrioritiesSorterComponent;
  let fixture: ComponentFixture<TablePrioritiesSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablePrioritiesSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePrioritiesSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
