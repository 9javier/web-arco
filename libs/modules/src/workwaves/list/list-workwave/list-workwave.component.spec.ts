import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwaveListWorkwavesComponent } from './list-workwave.component';

describe('WorkwaveListWorkwavesComponent', () => {
  let component: WorkwaveListWorkwavesComponent;
  let fixture: ComponentFixture<WorkwaveListWorkwavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveListWorkwavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveListWorkwavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
