import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrintComponent } from './modal-print.component';

describe('ModalPrintComponent', () => {
  let component: ModalPrintComponent;
  let fixture: ComponentFixture<ModalPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
