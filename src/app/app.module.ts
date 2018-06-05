import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarGeneratorComponent } from './calendar-generator/calendar-generator.component';
import { AboutComponent } from './about/about.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../theme/theme';
import { GitHubService } from '../services/github.service';
import { NPMService } from '../services/npm.service';
import { MenuService } from '../services/menu.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRouter } from './app.router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CalendarGeneratorComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRouter,
    LayoutModule,
    MaterialModule,
    FlexLayoutModule

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [GitHubService, MenuService, NPMService],
  bootstrap: [AppComponent]
})
export class AppModule { }
