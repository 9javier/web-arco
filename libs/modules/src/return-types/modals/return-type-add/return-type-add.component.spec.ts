import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnTypeAddComponent } from './return-type-add.component';

describe('ReturnTypeAddComponent', () => {
  let component: ReturnTypeAddComponent;
  let fixture: ComponentFixture<ReturnTypeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnTypeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
