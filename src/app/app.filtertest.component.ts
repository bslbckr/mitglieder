import { Component, Inject, ViewChildren, QueryList } from '@angular/core';
import { FilterComponent } from './filter/FilterComponent';

@Component({
    selector: 'app-filter-test',
    template: '<h2>it works</h2><div *ngFor="let filter of injectedFilters"><app-filter #appFilter [provider]="filter"></app-filter></div>'
})
export class FilterTestComponent {


}
