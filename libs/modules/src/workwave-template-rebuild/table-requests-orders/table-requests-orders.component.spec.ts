import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRequestsOrdersComponent } from './table-requests-orders.component';

describe('TableEmployeesComponent', () => {
  let component: TableRequestsOrdersComponent;
  let fixture: ComponentFixture<TableRequestsOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableRequestsOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRequestsOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
