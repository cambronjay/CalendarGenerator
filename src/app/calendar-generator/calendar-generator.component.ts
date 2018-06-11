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
import * as holidays from 'date-holidays';
import * as _ from 'lodash';
import * as calendar from 'node-calendar';
export class Country {
  constructor(public name: string, public code: string, ) { }
}

@Component({
  selector: 'calendar-generator',
  templateUrl: './calendar-generator.component.html',
  styleUrls: ['./calendar-generator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarGeneratorComponent {
  private calendarForm: FormGroup;
  private filteredCountries: Observable<any[]>;
  private countries: Country[] = countryCodes;
  private calendars = [];
  private daysOfWeek = [];
  private isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
    map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private menuService: MenuService, private fb: FormBuilder, private adapter: DateAdapter<any>, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.calendarForm = this.fb.group({
      countryCode: ['', [Validators.required, Validators.pattern(countryCodePattern)]],
      startDate: [{ value: '', disabled: true }, Validators.required],
      numberOfDays: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('(^[1-9]+)|([1-9]\d*)')]],
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
        if (this.calendarForm.get('countryCode').value.toLowerCase() == 'us') {
          moment.locale('en');
        } else {
          moment.locale(this.calendarForm.get('countryCode').value.toLowerCase());
        }
        this.calendarForm.get('startDate').enable();
        this.calendarForm.get('numberOfDays').enable();
      } else {
        this.calendarForm.get('startDate').disable();
        this.calendarForm.get('numberOfDays').disable();
      }
    }
  }

  private generate(): void {
    this.calendars = [];
    let startDate = moment(this.calendarForm.get('startDate').value).format('YYYY-MM-DD');
    this.daysOfWeek = moment().localeData().weekdaysMin();
    let endDate = moment(this.calendarForm.get('startDate').value).add(this.calendarForm.get('numberOfDays').value, 'days').format('YYYY-MM-DD');
    let calendar = genCalendarObj(startDate, endDate);
    let calendarDate = Array.from(Object.keys(calendar.date), k => calendar.date[k]);
    calendarDate = _.filter(calendarDate, function (o) {
      return o.inputRange == true;
    });
    let calendarYears = _.flatMap(calendarDate, function (o) {
      return o.year;
    });
    calendarYears = _.uniq(calendarYears);
    let years = [];
    let y;
    for (y = 0; y < calendarYears.length; y++) {
      let year = {
        year: calendarYears[y].toString(),
        months: this.monthsInYear(calendarYears[y], calendarDate)
      }
      years.push(year);
    }

    years.forEach(year => {
      year.months = _.filter(year.months, function (o) {
        return o.weeksInMonth != null;
      })
    });
    this.calendars = years;
  }

  private filterCountries(identifier: string): Country[] {
    return this.countries.filter(country =>
      (country.name.toLowerCase().indexOf(identifier.toLowerCase()) === 0) || (country.code.toLowerCase().indexOf(identifier.toLowerCase()) === 0)
    );
  }

  private visibleDaysInMonth(daysInRangeInMonth: any, numberOfdaysInMonth: number, year: number, month: number): Array<any> {
    let cal = new calendar.Calendar(calendar.SUNDAY);
    let countryHolidays = new holidays(this.calendarForm.get('countryCode').value);
    let weeks = cal.monthdayscalendar(year, month);
    let newMonth = [];
    let monthsInWeek = weeks.forEach(week => {
      let newWeek = week.map(day => {
        let newDay;
        if (day == 0) {
          newDay = {
            day: null,
            dayOfTheWeek: null,
            isInRange: false,
            isHoliday: false,
            isWeekDay: false
          }
        } else {
          let time = year.toString() + "-" + day.toString() + "-" + month.toString();
          let isInRange = _.find(daysInRangeInMonth, function (o) {
            return o.day == day;
          });
          let dayOfWeek = moment(time, "YYYY-DD-MM").isoWeekday();
          let isWeekDay: boolean;
          if (dayOfWeek == 6 || dayOfWeek == 7) {
            isWeekDay = false;
          } else {
            isWeekDay = true;
          }
          newDay = {
            day: day,
            dayOfTheWeek: dayOfWeek,
            isInRange: isInRange ? true : false,
            isHoliday: countryHolidays.isHoliday(moment(time, "YYYY-DD-MM").toDate()),
            isWeekDay: isWeekDay
          }
        }
        return newDay;
      });
      newMonth.push(newWeek);
    });
    return newMonth;
  }

  private getBackgroundColor(day: any): any {
    if (!day.isInRange) {
      return 'disable';
    } else {
      if (day.isHoliday) {
        return 'holiday';
      } else {
        if (day.isWeekDay) {
          return 'weekday';
        } else {
          return 'weekend';
        }
      }
    }
  }

  private monthsInYear(year: number, days: any): Array<any> {
    let months = [];
    let m;
    for (m = 1; m < 13; m++) {
      let timeStamp = year.toString() + "-" + m.toString();
      let numberOfdaysInMonth = moment(timeStamp, "YYYY-MM").daysInMonth() + 1;
      let daysInRangeInMonth = _.filter(days, function (o) {
        return o.year == year && o.month == m;
      });
      let monthOfYear = m - 1;
      let month = {
        month: moment(monthOfYear.toString(), 'MM').format('MMMM'),
        year: moment(year.toString(), 'YYYY').format('YYYY'),
        weeksInMonth: daysInRangeInMonth.length > 0 ? this.visibleDaysInMonth(daysInRangeInMonth, numberOfdaysInMonth, year, m) : null,
      }

      months.push(month);
    }
    return months;
  }

}
