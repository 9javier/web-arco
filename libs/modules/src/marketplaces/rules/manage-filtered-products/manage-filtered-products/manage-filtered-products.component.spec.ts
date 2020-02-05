import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFilteredProductsComponent } from './manage-filtered-products.component';

describe('ManageFilteredProductsComponent', () => {
  let component: ManageFilteredProductsComponent;
  let fixture: ComponentFixture<ManageFilteredProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFilteredProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFilteredProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
