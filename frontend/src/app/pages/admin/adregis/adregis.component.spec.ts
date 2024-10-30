import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdregisComponent } from './adregis.component';

describe('AdregisComponent', () => {
  let component: AdregisComponent;
  let fixture: ComponentFixture<AdregisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdregisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdregisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
