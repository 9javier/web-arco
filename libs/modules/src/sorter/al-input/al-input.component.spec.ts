import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlInputSorterComponent } from './al-input.component';

describe('AlInputSorterComponent', () => {
  let component: AlInputSorterComponent;
  let fixture: ComponentFixture<AlInputSorterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlInputSorterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlInputSorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
