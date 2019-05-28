import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwaveListWorkwavesHistoryComponent } from './list-workwave.component';

describe('WorkwaveListWorkwavesHistoryComponent', () => {
  let component: WorkwaveListWorkwavesHistoryComponent;
  let fixture: ComponentFixture<WorkwaveListWorkwavesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveListWorkwavesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveListWorkwavesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
