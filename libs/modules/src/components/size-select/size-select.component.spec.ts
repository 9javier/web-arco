import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeSelectComponent } from './size-select.component';

describe('SizeSelectComponent', () => {
  let component: SizeSelectComponent;
  let fixture: ComponentFixture<SizeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
