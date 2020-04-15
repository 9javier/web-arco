import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinyReceptionComponent } from './destiny-reception.component';

describe('DestinyReceptionComponent', () => {
  let component: DestinyReceptionComponent;
  let fixture: ComponentFixture<DestinyReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinyReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinyReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
