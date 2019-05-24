import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwaveListWorkwaveTemplateComponent } from './list-workwave.component';

describe('WorkwaveListWorkwaveTemplateComponent', () => {
  let component: WorkwaveListWorkwaveTemplateComponent;
  let fixture: ComponentFixture<WorkwaveListWorkwaveTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveListWorkwaveTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveListWorkwaveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
