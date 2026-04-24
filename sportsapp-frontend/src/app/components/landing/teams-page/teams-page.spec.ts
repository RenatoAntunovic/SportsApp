import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsPage } from './teams-page';

describe('TeamsPage', () => {
  let component: TeamsPage;
  let fixture: ComponentFixture<TeamsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
