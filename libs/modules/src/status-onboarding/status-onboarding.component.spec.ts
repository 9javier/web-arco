import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportsExpeditionsComponent } from './transports-expeditions.component';

describe('TransportsExpeditionsComponent', () => {
  let component: TransportsExpeditionsComponent;
  let fixture: ComponentFixture<TransportsExpeditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportsExpeditionsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportsExpeditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
