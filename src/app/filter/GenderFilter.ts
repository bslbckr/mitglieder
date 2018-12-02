import { Component } from '@angular/core';
import { FilterService, FilterFunc, noopFilter } from '../app.filter.service';

@Component({
    selector: 'app-gender-filter',
    templateUrl: './GenderFilter.html'
})
export class GenderFilterComponent {
    private static readonly filterName: string = 'GenderFilter';

    constructor(private filterSvc: FilterService) { }

    public onSelect(event: Event) {
        if (event && event.target) {
            const target = event.target as HTMLInputElement;
            const filterValue: string = target.value;
            let filterFunc: FilterFunc;
            if (filterValue === 'Alle') {
                filterFunc = noopFilter;
            } else {
                filterFunc = (m) => m.geschlecht === filterValue;
            }
            this.filterSvc.registerFilter(GenderFilterComponent.filterName, filterFunc);
        }
    }
}
