import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvExtractionComponent } from './cv-extraction.component';

describe('CvExtractionComponent', () => {
  let component: CvExtractionComponent;
  let fixture: ComponentFixture<CvExtractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvExtractionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvExtractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
