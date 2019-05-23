import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwavesComponent } from './workwaves.component';

describe('WorkwavesComponent', () => {
  let component: WorkwavesComponent;
  let fixture: ComponentFixture<WorkwavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
