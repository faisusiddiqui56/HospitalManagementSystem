import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedAppointMents } from './completed-appoint-ments';

describe('CompletedAppointMents', () => {
  let component: CompletedAppointMents;
  let fixture: ComponentFixture<CompletedAppointMents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedAppointMents],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedAppointMents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
