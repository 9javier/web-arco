import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsEnabledReceptionComponent } from './brands-enabled-reception.component';

describe('BrandsEnabledReceptionComponent', () => {
  let component: BrandsEnabledReceptionComponent;
  let fixture: ComponentFixture<BrandsEnabledReceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrandsEnabledReceptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsEnabledReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
