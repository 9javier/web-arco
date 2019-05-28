import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableLockContainerComponent } from './enable-lock-container.component';

describe('EnableLockContainerComponent', () => {
  let component: EnableLockContainerComponent;
  let fixture: ComponentFixture<EnableLockContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnableLockContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableLockContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
