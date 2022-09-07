import {Injectable} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DeviceInfoService {
    private readonly isHandset$: Observable<boolean>;
    private readonly isTablet$: Observable<boolean>;
    private readonly isTabletOrHandset$: ReplaySubject<boolean>;

    constructor(private breakpointObserver: BreakpointObserver) {
        this.isTabletOrHandset$ = new ReplaySubject<boolean>(1);

        this.isHandset$ = this.breakpointObserver
            .observe([Breakpoints.Small, Breakpoints.XSmall])
            .pipe(
                map(result => result.matches),
                shareReplay()
            );

        this.isTablet$ = this.breakpointObserver
            .observe([Breakpoints.Medium, Breakpoints.Tablet, Breakpoints.TabletLandscape, Breakpoints.TabletPortrait])
            .pipe(
                map(result => result.matches),
                shareReplay()
            );

        combineLatest([this.getIsTablet$(), this.getIsHandset$()]).subscribe(([isTablet, isHandset]) =>
            this.isTabletOrHandset$.next(isTablet || isHandset));
    }

    public getIsTabletOrHandset$() {
        return this.isTabletOrHandset$.pipe(distinctUntilChanged());
    }

    public getIsHandset$() {
        return this.isHandset$;
    }


    public getIsTablet$() {
        return this.isTablet$;
    }
}
