import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingHistoryComponent } from './picking.component';

describe('PickingHistoryComponent', () => {
  let component: PickingHistoryComponent;
  let fixture: ComponentFixture<PickingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
