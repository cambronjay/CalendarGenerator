import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MenuService } from '../../services/menu.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { countryCodes, countryCodePattern } from '../app.constants';
import { DateAdapter } from '@angular/material/core';
import { genCalendarObj } from 'calendar-generator';
import * as moment from 'moment';

export class Country {
  constructor(public name: string, public code: string, ) { }
}

@Component({
  selector: 'calendar-generator',
  templateUrl: './calendar-generator.component.html',
  styleUrls: ['./calendar-generator.component.css']
})
export class CalendarGeneratorComponent {
  private calendarForm: FormGroup;
  private filteredCountries: Observable<any[]>;
  private countries: Country[] = countryCodes;
  private isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
    map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private menuService: MenuService, private fb: FormBuilder, private adapter: DateAdapter<any>) { }

  ngOnInit() {
    this.calendarForm = this.fb.group({
      countryCode: ['', [Validators.required, Validators.pattern(countryCodePattern)]],
      startDate: [{ value: '', disabled: true }, Validators.required],
      numberOfDays: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('(^[0][1-9]+)|([1-9]\d*)')]],
    });

    this.filteredCountries = this.calendarForm.get('countryCode').valueChanges
      .pipe(
      startWith(''),
      tap(country => this.checkCountryCodeValidity(country)),
      map(country => country ? this.filterCountries(country) : this.countries.slice())
      );
  }

  private openSideNav(): void {
    this.menuService.openSideNav();
  }

  private checkCountryCodeValidity(identifier: string): void {
    if (identifier != '') {
      let checkValidity = this.calendarForm.get('countryCode').valid;
      if (checkValidity) {
        this.adapter.setLocale(this.calendarForm.get('countryCode').value.toLowerCase());
        this.calendarForm.get('startDate').enable();
        this.calendarForm.get('numberOfDays').enable();
      } else {
        this.calendarForm.get('startDate').disable();
        this.calendarForm.get('numberOfDays').disable();
      }
    }
  }

  private generate(): void {
    let startDate = moment(this.calendarForm.get('startDate').value).format('YYYY-MM-DD');
    let endDate = moment(this.calendarForm.get('startDate').value).add(this.calendarForm.get('numberOfDays').value, 'days').format('YYYY-MM-DD');
    let calendar = genCalendarObj(startDate, endDate);
    let calendarDate = Array.from(Object.keys(calendar.date), k => calendar.date[k]);
    calendarDate = calendarDate.filter(data => {
      data.inputRange == true;
    });
    let calendarMonthWeekDate = calendar.monthWeekDate;
    console.log(calendarDate);
    // console.log(calendarDate);
  }

  private filterCountries(identifier: string): Country[] {
    return this.countries.filter(country =>
      (country.name.toLowerCase().indexOf(identifier.toLowerCase()) === 0) || (country.code.toLowerCase().indexOf(identifier.toLowerCase()) === 0)
    );
  }



}
