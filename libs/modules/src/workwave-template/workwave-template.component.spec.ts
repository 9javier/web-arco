import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwaveTemplateComponent } from './workwave-template.component';

describe('WorkwaveTemplateComponent', () => {
  let component: WorkwaveTemplateComponent;
  let fixture: ComponentFixture<WorkwaveTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
