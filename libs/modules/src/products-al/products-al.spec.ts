import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAlComponent } from './products-al.component';

describe('ProductsAlComponent', () => {
  let component: ProductsAlComponent;
  let fixture: ComponentFixture<ProductsAlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsAlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsAlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
