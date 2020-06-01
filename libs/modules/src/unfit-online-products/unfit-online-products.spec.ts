import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnfitOnlineProductsComponent } from './unfit-online-products.component';

describe('UnfitOnlineProductsComponent', () => {
  let component: UnfitOnlineProductsComponent;
  let fixture: ComponentFixture<UnfitOnlineProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnfitOnlineProductsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfitOnlineProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
