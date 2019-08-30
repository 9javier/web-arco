import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductsHistoryComponent } from './modal-products.component';

describe('ListProductsHistoryComponent', () => {
  let component: ListProductsHistoryComponent;
  let fixture: ComponentFixture<ListProductsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
