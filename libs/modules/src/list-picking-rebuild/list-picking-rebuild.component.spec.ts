import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPickingRebuildComponent } from './list-picking-rebuild.component';

describe('ListPickingRebuildComponent', () => {
  let component: ListPickingRebuildComponent;
  let fixture: ComponentFixture<ListPickingRebuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPickingRebuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPickingRebuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
