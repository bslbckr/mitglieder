import { InjectionToken } from '@angular/core';
import { AbstractFilterDescriptor } from './AbstractFilterDescriptor';

export const injectionToken: InjectionToken<AbstractFilterDescriptor<{}>> =
    new InjectionToken<AbstractFilterDescriptor<{}>>('Filter injection token');
