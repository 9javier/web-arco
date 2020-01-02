import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCodesComponent } from './input-codes.component';

describe('InputCodesComponent', () => {
  let component: InputCodesComponent;
  let fixture: ComponentFixture<InputCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
