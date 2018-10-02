import { Component } from '@angular/core';
import { FilterService, FilterFunc } from "../app.filter.service";

@Component({
    selector: 'app-gender-filter',
    templateUrl: './GenderFilter.html'
})
export class GenderFilter {

    constructor(private filterSvc: FilterService) { };
}
