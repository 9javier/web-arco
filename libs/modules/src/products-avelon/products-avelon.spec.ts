import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAvelonComponent } from './products-avelon.component';

describe('ProductsAvelonComponent', () => {
  let component: ProductsAvelonComponent;
  let fixture: ComponentFixture<ProductsAvelonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsAvelonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsAvelonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
