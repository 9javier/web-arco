import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnTypeDetailsComponent } from './return-type-details.component';

describe('ReturnTypeDetailsComponent', () => {
  let component: ReturnTypeDetailsComponent;
  let fixture: ComponentFixture<ReturnTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
