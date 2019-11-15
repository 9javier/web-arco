import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerManualComponent } from './scanner-manual.component';

describe('ScannerManualComponent', () => {
  let component: ScannerManualComponent;
  let fixture: ComponentFixture<ScannerManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
