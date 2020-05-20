import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierConditionDetailsComponent } from './supplier-condition-details.component';

describe('ProductDetailsComponent', () => {
  let component: SupplierConditionDetailsComponent;
  let fixture: ComponentFixture<SupplierConditionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierConditionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierConditionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
