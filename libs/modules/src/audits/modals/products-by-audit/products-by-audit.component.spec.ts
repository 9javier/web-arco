import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsByAuditComponent } from './products-by-audit.component';

describe('ProductsByAuditComponent', () => {
  let component: ProductsByAuditComponent;
  let fixture: ComponentFixture<ProductsByAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsByAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsByAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
