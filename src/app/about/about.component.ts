import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GitHubService } from '../../services/github.service';
import { NPMService } from '../../services/npm.service';
import { MenuService } from '../../services/menu.service';
import { GitHub } from '../../interfaces/github.interface';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  private gitHub$: Observable<GitHub>;
  private gitHubSubscription: Subscription;
  private gitHub: GitHub;
  private npm$: Observable<any>;
  private npmSubscription: Subscription;
  private npm: any;
  private blankAvatar: '../../assets/avatar.png';
  private isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
    map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private menuService: MenuService,
    private gitHubService: GitHubService,
    private npmService: NPMService,
    private ref: ChangeDetectorRef) {
    this.gitHub$ = gitHubService.getDetails();
    this.npm$ = npmService.getPackageDownloads();
  }

  ngOnInit() {
    this.gitHubSubscription = this.gitHub$
      .subscribe(data => {
        this.gitHub = data;
        this.ref.markForCheck();
      });
    this.npmSubscription = this.npm$
      .subscribe(data => {
        let sums = data;
        this.npm = sums.reduce((a, b) => ({ downloads: a.downloads + b.downloads }));
        this.ref.markForCheck();
      });
  }

  private getAvatarImage(): any {
    return this.gitHub ? { "background-image": "url(" + "'" + this.gitHub.avatar_url + "'" + ")" } : { "background-image": "url(" + "'" + this.blankAvatar + "'" + ")" };
  }

  private visitPortfolio():void {
    window.open("http://jaycambron.com", "_blank");
  }

  private visitGitHub():void {
    window.open("https://github.com/cambronjay", "_blank");
  }

  private visitLinkedIn():void {
    window.open("https://www.linkedin.com/in/jaycambron", "_blank");
  }

  private visitNPM():void {
    window.open("https://www.npmjs.com/~cambronjay", "_blank");
  }

  private openSideNav():void {
    this.menuService.openSideNav();
  }

  ngOnDestroy() {
    this.gitHubSubscription.unsubscribe();
    this.npmSubscription.unsubscribe();
  }

}
