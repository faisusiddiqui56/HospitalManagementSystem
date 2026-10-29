import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointMents } from './appoint-ments';

describe('AppointMents', () => {
  let component: AppointMents;
  let fixture: ComponentFixture<AppointMents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointMents],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointMents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
