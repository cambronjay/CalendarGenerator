import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MenuService {
    public menuState = new BehaviorSubject<boolean>(false);
    constructor() {

    }

    public openSideNav():void {
        this.menuState.next(true);   
    }

    public closeSideNav():void {
        this.menuState.next(false);   
    }

}