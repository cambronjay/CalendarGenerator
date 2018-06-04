
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarGeneratorComponent } from './calendar-generator.component';

describe('CalendarGeneratorComponent', () => {
  let component: CalendarGeneratorComponent;
  let fixture: ComponentFixture<CalendarGeneratorComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
