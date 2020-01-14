import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferVentilationComponent } from './transfer-ventilation.component';

describe('TransferVentilationComponent', () => {
  let component: TransferVentilationComponent;
  let fixture: ComponentFixture<TransferVentilationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferVentilationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferVentilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
