import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwaveTemplateRebuildComponent } from './workwave-template-rebuild.component';

describe('WorkwaveTemplateRebuildComponent', () => {
  let component: WorkwaveTemplateRebuildComponent;
  let fixture: ComponentFixture<WorkwaveTemplateRebuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveTemplateRebuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveTemplateRebuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
