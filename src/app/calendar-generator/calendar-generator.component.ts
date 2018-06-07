import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MenuService } from '../../services/menu.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { countryCodes, countryCodePattern } from '../app.constants';
import { DateAdapter } from '@angular/material/core';
import { genCalendarObj } from 'calendar-generator';
import { Calendar } from '../../interfaces/calendar.interface';
import * as moment from 'moment';
import * as holidays from 'date-holidays';
import * as _ from 'lodash';

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
  private calendars = [];
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
    this.calendars = [];
    let startDate = moment(this.calendarForm.get('startDate').value).format('YYYY-MM-DD');
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
   // let monthsInYears = this.monthsInYears(calendarDate);
    // years.forEach(year => {
    //   year.months = _.filter(monthsInYears, function(o){
    //     return o.year == year.year
    //   })
    // });
    // let c;
    // for(c = 0; c < years.length; c++){
    //   let monthsInYears = this.monthsInYear(calendarDate);

    // }
    // //let calendarMonthWeekDate = calendar.monthWeekDate;
    // let m;
    // for (m = 0; m < calendarDate.length; m++) {
    //   let calendar = {
    //     month: this.lookUpMonth(calendarDate[m].month),
    //     daysInMonth: this.daysInMonth(moment(calendarDate[m].year.toString(),calendarDate[m].month.toString(), "YYYY-MM").daysInMonth(), calendarDate),
    //   }
    //   this.calendars.push(calendar);
    // }
    years.forEach(year=> {
      year.months = _.filter(year.months, function(o){
        return o.daysInMonth != null;
      })
    });
    this.calendars = years;
    console.log(calendarDate);
    console.log(calendarYears);
    console.log(years)
  }
 
  private filterCountries(identifier: string): Country[] {
    return this.countries.filter(country =>
      (country.name.toLowerCase().indexOf(identifier.toLowerCase()) === 0) || (country.code.toLowerCase().indexOf(identifier.toLowerCase()) === 0)
    );
  }

  private lookUpMonth(day:number): string {
    let month;
    switch (day) {
      case 1:
        month = 'January';
        break;
      case 2:
        month = 'February';
        break;
      case 3:
        month = 'March';
        break;
      case 4:
        month = 'April';
        break;
      case 5:
        month = 'May';
        break;
      case 6:
        month = 'June';
        break;
      case 7:
        month = 'July';
        break;
      case 8:
        month = 'August';
        break;
      case 9:
        month = 'September';
        break;
      case 10:
        month = 'October';
        break;
      case 11:
        month = 'November';
        break;
      case 12:
        month = 'December';
        break;
      default:
        month = 'January';
    }
    return month;
  }

  private visibleDaysInMonth(daysInRangeInMonth: any, numberOfdaysInMonth: number, year: number, month: number): Array<any> {
    let allDays = [];
    let countryHolidays = new holidays(this.calendarForm.get('countryCode').value);
    let d;
    for(d=1; d < numberOfdaysInMonth; d++) {
      let time = year.toString()+"-"+d.toString()+"-"+month.toString();
      let isInRange = _.find(daysInRangeInMonth, function(o){
        return o.day == d;
      });
      let dayOfWeek = moment(time,"YYYY-DD-MM").isoWeekday();
      let isWeekDay: boolean;
      if(dayOfWeek == 6 || dayOfWeek == 7){
        isWeekDay = false;
      } else {
        isWeekDay = true;
      }
      let dayOfMonth = {
        day: d,
        dayOfTheWeek: dayOfWeek,
        isInRange: isInRange ? true: false,
        isHoliday: countryHolidays.isHoliday(moment(time,"YYYY-DD-MM").toDate()),
        isWeekDay: isWeekDay
      }      
      allDays.push(dayOfMonth);
    }
   // });
    // for(d=1; d < numberOfdaysInMonth; d++) {
    //   let dayOfMonth;
    //   //let dayInRange = daysInRangeInMonth.indexOf(d);
    //   // let dayInRange = _.find(daysInRangeInMonth, function(o) {
    //   //   console.log(d);
    //   //   console.log(o.day);
    //   //   o.day == d;
    //   // });
    //   // if(dayInRange > 0){
    //   //   let time = daysInRangeInMonth[dayInRange].year.toString()+"-"+daysInRangeInMonth[dayInRange].day.toString()+"-"+daysInRangeInMonth[dayInRange].month.toString();
    //   //   dayOfMonth = {
    //   //     day: d,
    //   //     isInRange: true,
    //   //     isHoliday: countryHolidays.isHoliday(moment(time,"YYYY-DD-MM").toDate()),
    //   //     isWeekDay: this.isWeekDay(moment(time,"YYYY-DD-MM").isoWeekday())
    //   //   }
    //   // } else {
    //   //   let time = year.toString()+"-"+d.toString()+"-"+month.toString();
    //   //   dayOfMonth = {
    //   //     day: d,
    //   //     isInRange: false,
    //   //     isHoliday: countryHolidays.isHoliday(moment(time,"YYYY-DD-MM").toDate()),
    //   //     isWeekDay: this.isWeekDay(moment(time,"YYYY-DD-MM").isoWeekday())
    //   //   }
    //   // }
    //   let time = year.toString()+"-"+d.toString()+"-"+month.toString();
    //   dayOfMonth = {
    //     day: d,
    //    // isInRange: this.dayIsInRange(daysInRangeInMonth, d),
    //     isInRange: true,
    //     isHoliday: countryHolidays.isHoliday(moment(time,"YYYY-DD-MM").toDate()),
    //     isWeekDay: this.isWeekDay(moment(time,"YYYY-DD-MM").isoWeekday())
    //   }      
    //   allDays.push(dayOfMonth);
    // }
    return allDays;
  }
  private getBackgroundColor(day: any): any {
    if(!day.isInRange){
      return { "background-color": "gray" };
    } else {
      if(day.isHoliday){
        return { "background-color": "orange" };
      } else {
        if(day.isWeekDay){
          return { "background-color": "green" };
        } else {
          return { "background-color": "yellow" };
        }
      }
    }
  }
  // private daysInMonth(daysInMonth: number, days: any, year: number): Array<any> {
  //   let allDays = [];
  //   let countryHolidays = new holidays(this.calendarForm.get('countryCode').value);
  //   let d;
  //   for(d=0; d < daysInMonth; d++) {
  //     let dayOfMonth;
  //     let dayInRange = _.find(days, function(o) {
  //       o.day == d
  //     });
      
  //     if(dayInRange != undefined){
  //       let time = dayInRange.year.toString()+"-"+dayInRange.day.toString()+"-"+dayInRange.month.toString();
  //       dayOfMonth = {
  //         day: d,
  //         isInRange: true,
  //         isHoliday: countryHolidays.isHoliday(moment(time,"YYYY-DD-MM").toDate()),
  //         isWeekDay: this.isWeekDay(moment(time,"YYYY-DD-MM").isoWeekday())
  //       }
  //     } else {
  //       let time = year.toString()+"-"+d.toString()+"-"+days[d].month.toString();
  //       dayOfMonth = {
  //         day: d,
  //         isInRange: false,
  //         isHoliday: false,
  //         isWeekDay: this.isWeekDay(moment(time,"YYYY-DD-MM").isoWeekday())
  //       }
  //     }
  //     allDays.push(dayOfMonth);
  //   }
  //   return allDays;
  // }

  private isWeekDay(dayOfWeek: number): boolean {
    if(dayOfWeek == 6 || dayOfWeek == 7){
      return false;
    } else {
      return true;
    }
  }

  private monthsInYear(year: number, days: any): Array<any> {
    let months = [];
    let m;
    for (m = 1; m < 13; m++) {
      let timeStamp = year.toString()+"-"+m.toString();
      let numberOfdaysInMonth = moment(timeStamp,"YYYY-MM").daysInMonth() + 1;
      let daysInRangeInMonth = _.filter(days, function(o){
        return o.year == year && o.month == m;
      });
      
      let month = {
        month: this.lookUpMonth(m),
        year: year.toString(),
        daysInMonth: daysInRangeInMonth.length > 0 ? this.visibleDaysInMonth(daysInRangeInMonth, numberOfdaysInMonth, year, m) : null,
      }
      //this.daysInMonth(moment(time,"YYYY-MM").daysInMonth(), days, days[m].year)
      months.push(month);
    }
    return months;
  }

  // private monthsInYears(days: any): Array<any> {
  //   let months = [];
  //   let m;
  //   for (m = 0; m < days.length; m++) {
  //     let time = days[m].year.toString()+"-"+days[m].month.toString();
  //     let month = {
  //       month: this.lookUpMonth(days[m].month),
  //       year: days[m].year,
  //       daysInMonth: this.daysInMonth(moment(time,"YYYY-MM").daysInMonth(), days, days[m].year),
  //     }
  //     months.push(month);
  //   }
  //   return months;
  // }


}
