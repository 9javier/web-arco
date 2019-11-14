import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkwaveTemplateOnlineStoreComponent } from './workwave-template-online-store.component';

describe('WorkwaveTemplateOnlineStoreComponent', () => {
  let component: WorkwaveTemplateOnlineStoreComponent;
  let fixture: ComponentFixture<WorkwaveTemplateOnlineStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkwaveTemplateOnlineStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkwaveTemplateOnlineStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
