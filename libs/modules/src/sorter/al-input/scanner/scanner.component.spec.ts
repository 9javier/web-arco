import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerInputSorterComponent } from './scanner.component';

describe('ScannerInputSorterComponent', () => {
  let component: ScannerInputSorterComponent;
  let fixture: ComponentFixture<ScannerInputSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerInputSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerInputSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
