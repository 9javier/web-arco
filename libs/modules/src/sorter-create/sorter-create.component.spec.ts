import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SorterCreateComponent } from './sorter-create.component';

describe('SorterCreateComponent', () => {
  let component: SorterCreateComponent;
  let fixture: ComponentFixture<SorterCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SorterCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SorterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
