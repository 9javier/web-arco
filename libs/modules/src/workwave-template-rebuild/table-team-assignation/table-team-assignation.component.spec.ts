import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTeamAssignationComponent } from './table-team-assignation.component';

describe('TableStoresComponent', () => {
  let component: TableTeamAssignationComponent;
  let fixture: ComponentFixture<TableTeamAssignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTeamAssignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTeamAssignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
