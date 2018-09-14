import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectionToken } from './Filter';
import { TestFilterComponent } from './TestFilterComponent';
import { TestFilterDescriptor } from './TestFilterDescriptor';

@NgModule({
    imports: [CommonModule],
    providers: [{
        provide: injectionToken, multi: true, useClass: TestFilterDescriptor
    }
    ],
    declarations: [TestFilterComponent],
    entryComponents: [TestFilterComponent],
    exports: [TestFilterComponent]
})
export class FilterModule {
}
