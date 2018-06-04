import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
    map(result => result.matches)
    );
  private toggleMenu$: Observable<boolean>;
  private toggleMenuSubscription: Subscription;
  private toggleMenu: boolean;

  constructor(private breakpointObserver: BreakpointObserver, private menuService: MenuService, private ref: ChangeDetectorRef, ) {
    this.toggleMenu$ = this.menuService.menuState.asObservable();
  }

  ngOnInit() {
    this.toggleMenuSubscription = this.toggleMenu$
      .subscribe(data => {
        this.toggleMenu = data;
        console.log(data)
        this.ref.markForCheck();
      });
  }

  private menuToggle(isHandset: boolean): boolean {
    if (isHandset) {
      return this.toggleMenu;
    } else {
      return true;
    }
  }

  private closeSidenav(): void {
    this.menuService.closeSideNav();
  }

  ngOnDestroy() {
    this.toggleMenuSubscription.unsubscribe();
  }
}
