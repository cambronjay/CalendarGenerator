import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarGeneratorComponent } from './calendar-generator/calendar-generator.component';
import { AboutComponent } from './about/about.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/calendar-generator', pathMatch: 'full' },
    {
        path: 'calendar-generator',
        component: CalendarGeneratorComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: '**',
        component: CalendarGeneratorComponent
    }
];

export const AppRouter: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });