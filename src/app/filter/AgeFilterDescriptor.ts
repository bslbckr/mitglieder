import { Injectable, Type } from '@angular/core';
import { AbstractFilterDescriptor } from './AbstractFilterDescriptor';
import { AgeFilterComponent } from './AgeFilterComponent';

@Injectable()
export class AgeFilterDescriptor extends AbstractFilterDescriptor<AgeFilterComponent> {

    public get ComponentType(): Type<AgeFilterComponent> {
        return AgeFilterComponent;
    }

}
