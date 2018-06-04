import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarGeneratorComponent } from './calendar-generator/calendar-generator.component';
import { AboutComponent } from './about/about.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../theme/theme';
import { GitHubService } from '../services/github.service';
import { MenuService } from '../services/menu.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRouter } from './app.router';

@NgModule({
  declarations: [
    AppComponent,
    CalendarGeneratorComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRouter,
    LayoutModule,
    MaterialModule,
    FlexLayoutModule

  ],
  providers: [GitHubService, MenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
