import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPickingHistoryComponent } from './list-picking.component';

describe('ListPickingHistoryComponent', () => {
  let component: ListPickingHistoryComponent;
  let fixture: ComponentFixture<ListPickingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPickingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPickingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
