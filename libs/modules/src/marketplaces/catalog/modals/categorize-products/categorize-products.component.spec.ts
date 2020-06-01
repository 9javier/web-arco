import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorizeProductsComponent } from './categorize-products.component';

describe('CategorizeProductsComponent', () => {
  let component: CategorizeProductsComponent;
  let fixture: ComponentFixture<CategorizeProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorizeProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorizeProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
