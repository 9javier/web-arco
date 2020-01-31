import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryWarehouseModalComponent } from './history_whs_modal.component';

describe('StoryWharehouseComponent', () => {
  let component: HistoryWarehouseModalComponent;
  let fixture: ComponentFixture<HistoryWarehouseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryWarehouseModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryWarehouseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
