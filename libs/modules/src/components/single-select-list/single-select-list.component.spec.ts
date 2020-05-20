import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectListComponent } from './single-select-list.component';

describe('SingleSelectListComponent', () => {
  let component: SingleSelectListComponent;
  let fixture: ComponentFixture<SingleSelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSelectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
