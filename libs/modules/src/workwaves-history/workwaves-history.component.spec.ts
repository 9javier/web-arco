import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwavesHistoryComponent } from './workwaves-history.component';

describe('WorkwavesHistoryComponent', () => {
  let component: WorkwavesHistoryComponent;
  let fixture: ComponentFixture<WorkwavesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwavesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwavesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
