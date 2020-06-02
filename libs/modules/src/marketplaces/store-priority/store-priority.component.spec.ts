import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePriorityComponent } from './store-priority.component';

describe('StorePriorityComponent', () => {
  let component: StorePriorityComponent;
  let fixture: ComponentFixture<StorePriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorePriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorePriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
