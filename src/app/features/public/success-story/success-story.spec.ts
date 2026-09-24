import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessStory } from './success-story';

describe('SuccessStory', () => {
  let component: SuccessStory;
  let fixture: ComponentFixture<SuccessStory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessStory],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessStory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
