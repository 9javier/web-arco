import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNewProductsComponent } from './list-new-products.component';

describe('ListNewProductsComponent', () => {
  let component: ListNewProductsComponent;
  let fixture: ComponentFixture<ListNewProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListNewProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNewProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
