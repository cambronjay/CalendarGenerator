import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class GitHubService {

    constructor(private http: HttpClient) {

    }

    // Search for users
    public searchUsers(searchParam: string) {
        return this.http.get(`https://api.github.com/search/users?q=${searchParam}`)
            .pipe(
            catchError(this.handleError)
            );
    }

    // Get user details
    public getDetails(): Observable<any> {
        return this.http.get('https://api.github.com/users/cambronjay')
            .pipe(
            catchError(this.handleError)
            );
    }

    // Get user repo details
    public getrepoDetails(login: string) {
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