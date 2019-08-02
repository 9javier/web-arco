import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReceivedProductComponent } from './print-received-product.component';

describe('PrintReceivedProductComponent', () => {
  let component: PrintReceivedProductComponent;
  let fixture: ComponentFixture<PrintReceivedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintReceivedProductComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReceivedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
