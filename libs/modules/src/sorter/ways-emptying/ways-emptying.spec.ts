import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaysEmptyingComponent } from './ways-emptying';

describe('WaysEmptyingComponent', () => {
  let component: WaysEmptyingComponent;
  let fixture: ComponentFixture<WaysEmptyingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaysEmptyingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaysEmptyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
