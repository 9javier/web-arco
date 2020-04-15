import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoHeaderReceptionComponent } from './info-header-reception.component';

describe('InfoHeaderReceptionComponent', () => {
  let component: InfoHeaderReceptionComponent;
  let fixture: ComponentFixture<InfoHeaderReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoHeaderReceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoHeaderReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
