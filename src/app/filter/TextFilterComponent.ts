import { Component } from "@angular/core";
import { FilterService, noopFilter } from "../app.filter.service";

@Component({
    selector: 'text-filter',
    templateUrl: './TextFilterComponent.html'
})
export class TextFilterComponent {
    private static readonly filterName = 'textFilter';

    constructor(private filterSrv: FilterService) { }

    public onSelect(event: Event): void {
        if (event && event.target) {
            const target = event.target as HTMLInputElement;
            const filterValue = target.value;
            let func = noopFilter;
            if (filterValue && filterValue.length > 0) {
                func = (m) => (m.vorname && (m.vorname.indexOf(filterValue) > -1)) || (m.name && (m.name.indexOf(filterValue) > -1)) || false;
            }
            this.filterSrv.registerFilter(TextFilterComponent.filterName, func);
        }
    }
}
