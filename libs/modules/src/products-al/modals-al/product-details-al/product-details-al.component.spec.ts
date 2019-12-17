import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsAlComponent } from './product-details-al.component';

describe('ProductDetailsAlComponent', () => {
  let component: ProductDetailsAlComponent;
  let fixture: ComponentFixture<ProductDetailsAlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsAlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsAlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
