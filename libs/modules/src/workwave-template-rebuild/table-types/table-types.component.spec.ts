import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTypesComponent } from './table-types.component';

describe('TableTypesComponent', () => {
  let component: TableTypesComponent;
  let fixture: ComponentFixture<TableTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
