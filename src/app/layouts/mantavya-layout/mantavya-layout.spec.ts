import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantavyaLayout } from './mantavya-layout';

describe('MantavyaLayout', () => {
  let component: MantavyaLayout;
  let fixture: ComponentFixture<MantavyaLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantavyaLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(MantavyaLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
