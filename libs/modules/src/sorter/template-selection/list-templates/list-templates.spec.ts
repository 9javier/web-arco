import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SorterListTemplatesSelectionComponent } from './list-templates';

describe('SorterListTemplatesSelectionComponent', () => {
  let component: SorterListTemplatesSelectionComponent;
  let fixture: ComponentFixture<SorterListTemplatesSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SorterListTemplatesSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterListTemplatesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
