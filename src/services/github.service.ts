import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class GitHubService {

    constructor(private http: HttpClient) {

    }

    // Get user details
    public getDetails(): Observable<any> {
        return this.http.get('https://api.github.com/users/cambronjay')
            .pipe(
            catchError(this.handleError)
            );
    }

    // Get user repo details
    public getrepoDetails(login: string): Observable<any> {
        return this.http.get(`https://api.github.com/users/cambronjay/repos`)
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