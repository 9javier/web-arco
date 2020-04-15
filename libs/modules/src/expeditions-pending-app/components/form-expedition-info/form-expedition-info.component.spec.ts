import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpeditionInfoComponent } from './form-expedition-info.component';

describe('FormExpeditionInfoComponent', () => {
  let component: FormExpeditionInfoComponent;
  let fixture: ComponentFixture<FormExpeditionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormExpeditionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExpeditionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
