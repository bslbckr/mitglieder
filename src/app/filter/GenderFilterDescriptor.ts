import { AbstractFilterDescriptor } from './AbstractFilterDescriptor';
import { GenderFilter } from './GenderFilter';
import { Injectable, Type } from '@angular/core';

@Injectable()
export class GenderFilterDescriptor extends AbstractFilterDescriptor<GenderFilter> {

    public get ComponentType(): Type<GenderFilter> {
        return GenderFilter;
    }
}
