import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectScrollbarStateComponent } from './select-scrollbar-state.component';

describe('SelectScrollbarStateComponent', () => {
  let component: SelectScrollbarStateComponent;
  let fixture: ComponentFixture<SelectScrollbarStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectScrollbarStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectScrollbarStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
