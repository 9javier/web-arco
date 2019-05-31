import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveProductsComponent } from './move-products.component';

describe('EnableLockContainerComponent', () => {
  let component: MoveProductsComponent;
  let fixture: ComponentFixture<MoveProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
