import { Injectable } from '@angular/core';
import { MemberOverview } from './model/member-overview';
import { Observable } from 'rxjs';

export type FilterFunc = (m: MemberOverview) => boolean;
export const noopFilter: FilterFunc = (m) => true;
@Injectable()
export abstract class FilterService {

    public abstract registerFilter(filterName: string, filter: FilterFunc): void;
    public abstract filter(input: MemberOverview[]): MemberOverview[];

    public abstract get onFilterChanged(): Observable<string>;
}
