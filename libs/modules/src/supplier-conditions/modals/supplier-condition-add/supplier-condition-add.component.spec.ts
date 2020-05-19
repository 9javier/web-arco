import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierConditionAddComponent } from './supplier-condition-add.component';

describe('StoreComponent', () => {
  let component: SupplierConditionAddComponent;
  let fixture: ComponentFixture<SupplierConditionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierConditionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierConditionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
