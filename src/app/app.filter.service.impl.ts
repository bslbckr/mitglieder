import { Injectable, OnDestroy } from "@angular/core";
import { FilterFunc, FilterService, noopFilter } from "./app.filter.service";
import { MemberOverview } from "./model/member-overview";
import { Subject } from "rxjs";

type FilterMap = { [key: string]: FilterFunc };
@Injectable()
export class FilterServiceImpl extends FilterService implements OnDestroy {

    private filters: FilterMap = {};
    private filterChanged = new Subject<string>();

    public registerFilter(name: string, filter: FilterFunc): void {
        if (filter == null || filter == noopFilter) {
            delete this.filters[name];
        } else {
            this.filters[name] = filter;
        }
        this.filterChanged.next(name);
    }

    public filter(input: MemberOverview[]): MemberOverview[] {
        if (this.filters == undefined
            || this.filters == null
            || Object.keys(this.filters).length == 0) {
            return input;
        } else {
            return Object.keys(this.filters).map(k => this.filters[k])
                .reduce((prev: MemberOverview[], ff: FilterFunc) => prev.filter(ff), input);
        }
    }

    public get onFilterChanged() { return this.filterChanged; }

    public ngOnDestroy() {
        this.filterChanged.complete();
    }
}
