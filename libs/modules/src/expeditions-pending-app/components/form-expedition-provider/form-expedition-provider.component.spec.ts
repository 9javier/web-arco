import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExpeditionProviderComponent } from './form-expedition-provider.component';

describe('FormExpeditionProviderComponent', () => {
  let component: FormExpeditionProviderComponent;
  let fixture: ComponentFixture<FormExpeditionProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormExpeditionProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExpeditionProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
