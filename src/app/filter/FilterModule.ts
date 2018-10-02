import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectionToken } from './Filter';
import { GenderFilterDescriptor } from './GenderFilterDescriptor';
import { GenderFilter } from './GenderFilter';
import { StateFilterDescriptor } from './StateFilterDescriptor';
import { StateFilterComponent } from './StateFilterComponent';

const components: any[] = [GenderFilter, StateFilterComponent];

@NgModule({
    imports: [CommonModule],
    providers: [{
        provide: injectionToken, multi: true, useClass: StateFilterDescriptor
    }, {
        provide: injectionToken, multi: true, useClass: GenderFilterDescriptor
    }
    ],
    declarations: components,
    entryComponents: components,
    exports: components
})
export class FilterModule {
}
