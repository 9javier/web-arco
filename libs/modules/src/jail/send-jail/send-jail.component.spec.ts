import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendJailComponent } from './send-jail.component';

describe('SendJailComponent', () => {
  let component: SendJailComponent;
  let fixture: ComponentFixture<SendJailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendJailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendJailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
