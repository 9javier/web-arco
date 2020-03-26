import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonChangeState2Component } from './button-change-state2.component';

describe('ButtonChangeStateComponent', () => {
  let component: ButtonChangeState2Component;
  let fixture: ComponentFixture<ButtonChangeState2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonChangeState2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonChangeState2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
