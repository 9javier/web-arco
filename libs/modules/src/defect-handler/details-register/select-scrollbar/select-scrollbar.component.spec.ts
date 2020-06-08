import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectScrollbarComponent } from './select-scrollbar.component';

describe('SelectScrollbarComponent', () => {
  let component: SelectScrollbarComponent;
  let fixture: ComponentFixture<SelectScrollbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectScrollbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectScrollbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
