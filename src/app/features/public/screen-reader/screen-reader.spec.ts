import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenReader } from './screen-reader';

describe('ScreenReader', () => {
  let component: ScreenReader;
  let fixture: ComponentFixture<ScreenReader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenReader],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenReader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
