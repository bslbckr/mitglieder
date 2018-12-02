import { Component } from '@angular/core';
import { FilterService, FilterFunc, noopFilter } from '../app.filter.service';

@Component({
    templateUrl: './AgeFilterComponent.html',
    selector: 'age-filter'
})
export class AgeFilterComponent {
    private static readonly filterName = 'ageFilter';
    constructor(private filterSrv: FilterService) { }

    public onSelect(event: Event): void {
        if (event && event.target) {
            const target = event.target as HTMLInputElement;
            const filterValue = target.value;
            var func: FilterFunc;
            if (filterValue === 'Alle') {
                func = noopFilter;
            } else {
                const currentYear = new Date().getFullYear();

                switch (filterValue) {
                    case 'openMaster':
                        const referenceDate = `${currentYear - 33}-12-31`;
                        func = (m) => m.geburtsdatum <= referenceDate;
                        break;
                    case 'mixedMaster':
                        const referenceDateMen = `${currentYear - 33}-12-31`;
                        const referenceDateWomen = `${currentYear - 30}-12-31`;
                        func = (m) => m.geburtsdatum <= (m.geschlecht === 'weiblich' ? referenceDateWomen : referenceDateMen);
                        break;
                    case 'womenMaster':
                        const referencDateWomen = `${currentYear - 30}-12-31`;
                        func = (m) => m.geburtsdatum <= referencDateWomen;
                        break;
                    default:
                        func = noopFilter;
                }
            }
            this.filterSrv.registerFilter(AgeFilterComponent.filterName, func);
        }
    }
}
