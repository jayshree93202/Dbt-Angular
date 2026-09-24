import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskLayout } from './helpdesk-layout';

describe('HelpdeskLayout', () => {
  let component: HelpdeskLayout;
  let fixture: ComponentFixture<HelpdeskLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpdeskLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpdeskLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
