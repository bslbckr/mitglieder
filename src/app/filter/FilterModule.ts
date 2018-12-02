import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectionToken } from './Filter';
import { GenderFilterDescriptor } from './GenderFilterDescriptor';
import { GenderFilterComponent } from './GenderFilter';
import { StateFilterDescriptor } from './StateFilterDescriptor';
import { StateFilterComponent } from './StateFilterComponent';
import { AgeFilterComponent } from './AgeFilterComponent';
import { AgeFilterDescriptor } from './AgeFilterDescriptor';
import { TextFilterComponent } from './TextFilterComponent';
import { TextFilterDescriptor } from './TextFilterDescriptor';

const components: any[] = [GenderFilterComponent, StateFilterComponent, AgeFilterComponent, TextFilterComponent];

@NgModule({
    imports: [CommonModule],
    providers: [{
        provide: injectionToken, multi: true, useClass: StateFilterDescriptor
    }, {
        provide: injectionToken, multi: true, useClass: GenderFilterDescriptor
    }, {
        provide: injectionToken, multi: true, useClass: AgeFilterDescriptor
    }, {
        provide: injectionToken, multi: true, useClass: TextFilterDescriptor
    }
    ],
    declarations: components,
    entryComponents: components,
    exports: components
})
export class FilterModule {
}
