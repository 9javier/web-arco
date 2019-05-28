import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwavesTemplatesComponent } from './workwaves-templates.component';

describe('WorkwavesTemplatesComponent', () => {
  let component: WorkwavesTemplatesComponent;
  let fixture: ComponentFixture<WorkwavesTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwavesTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwavesTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
