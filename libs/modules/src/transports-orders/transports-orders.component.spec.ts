import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportsOrdersComponent } from './transports-orders.component';

describe('TransportsOrdersComponent', () => {
  let component: TransportsOrdersComponent;
  let fixture: ComponentFixture<TransportsOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportsOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportsOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
