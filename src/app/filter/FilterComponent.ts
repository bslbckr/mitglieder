import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'app-filter',
    templateUrl: './FilterComponent.html'
})
export class FilterComponent {

    @ViewChild('filterInput') elemRef: ElementRef;

}
