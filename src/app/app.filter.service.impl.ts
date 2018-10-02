import { Injectable } from "@angular/core";
import { FilterFunc, FilterService } from "./app.filter.service";
import { Member } from "./model/member";

type FilterMap = { [key: string]: FilterFunc };
@Injectable()
export class FilterServiceImpl extends FilterService {

    private filters: FilterMap = {};

    public registerFilter(name: string, filter: FilterFunc): void {
        if (filter == null) {
            delete this.filters[name];
        } else {
            this.filters[name] = filter;
        }
    }

    public filter(input: Member[]): Member[] {
        if (this.filters == undefined
            || this.filters == null
            || Object.keys(this.filters).length == 0) {
            return input;
        } else {
            return Object.keys(this.filters).map(k => this.filters[k])
                .reduce((prev: Member[], ff: FilterFunc) => prev.filter(ff), input);
        }
    }
}
