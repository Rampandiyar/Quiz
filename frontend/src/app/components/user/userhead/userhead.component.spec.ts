import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserheadComponent } from './userhead.component';

describe('UserheadComponent', () => {
  let component: UserheadComponent;
  let fixture: ComponentFixture<UserheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserheadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
