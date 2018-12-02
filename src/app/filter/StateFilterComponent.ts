import { Component } from '@angular/core';

import { FilterService, FilterFunc, noopFilter } from '../app.filter.service';

@Component({
    selector: 'app-state-filter',
    templateUrl: './StateFilterComponent.html'
})
export class StateFilterComponent {
    private static readonly filterName: string = 'StateFilter';

    constructor(private filterServe: FilterService) { }

    public onSelect(event: Event): void {
        if (event && event.target) {
            console.dir(event);
            const target = event.target as HTMLInputElement;
            const filterState: string = target.value;
            if (filterState === 'Alle') {
                this.filterServe.registerFilter(StateFilterComponent.filterName, noopFilter);
            } else {
                const filterFunc: FilterFunc = (m) => m.status === filterState;
                this.filterServe.registerFilter(StateFilterComponent.filterName, filterFunc);
            }
        }
    }
}
