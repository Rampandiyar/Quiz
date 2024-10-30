import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserquizComponent } from './userquiz.component';

describe('UserquizComponent', () => {
  let component: UserquizComponent;
  let fixture: ComponentFixture<UserquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserquizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
