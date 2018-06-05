import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable()
export class NPMService {

    constructor(private http: HttpClient) {

    }

    // Get package downloads
    public getPackageDownloads(): Observable<any> {
        return forkJoin([
            this.http.get('https://api.npmjs.org/downloads/point/2012-01-01:' + moment().format('YYYY-MM-DD') + '/location-utilities'),
            this.http.get('https://api.npmjs.org/downloads/point/2012-01-01:' + moment().format('YYYY-MM-DD') + '/ngrx-state-sync'),
            this.http.get('https://api.npmjs.org/downloads/point/2012-01-01:' + moment().format('YYYY-MM-DD') + '/enterprise-angular-generator')
        ])
            .pipe(
            catchError(this.handleError)
            );
    }

    // Error handler
    public handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Error code: ${error.status}, ` +
                `Error: ${error.error}`);
        }
        return throwError(
            'An error occurred! Please refresh the page.'
        );
    };


}