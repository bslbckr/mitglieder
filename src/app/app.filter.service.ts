import { Injectable } from "@angular/core";
import { Member } from "./model/member";

export type FilterFunc = (m: Member) => boolean;

@Injectable()
export abstract class FilterService {

    public abstract registerFilter(filterName: string, filter: FilterFunc): void;
    public abstract filter(input: Member[]): Member[];
}
