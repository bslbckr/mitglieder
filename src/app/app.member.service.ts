import { Injectable } from '@angular/core';
import { Member } from './model/member';

interface ReducedMember {
    year: number;
    sex: string;
}

interface Accumulator {
    current: { year: number, women: number, total: number } | null;
    result: { year: number, women: number, total: number }[];
}

class MemberReducer {

    private createCurrent(currentVal: ReducedMember): { year: number, women: number, total: number } {
        return {
            year: currentVal.year,
            total: 1,
            women: currentVal.sex === 'weiblich' ? 1 : 0
        };

    }

    reduce(initial: Accumulator, currentValue: ReducedMember, currendIndex?: number, arr?: ReducedMember[]): Accumulator {
        if (!initial || !initial.current) {
            initial = {
                current: this.createCurrent(currentValue),
                result: []
            };
        } else {
            if (initial.current.year === currentValue.year) {
                initial.current.total++;
                if (currentValue.sex === 'weiblich') {
                    initial.current.women++;
                }
            } else {
                initial.result.push(initial.current);
                initial.current = this.createCurrent(currentValue);
            }
        }
        return initial;
    }
}

@Injectable()
export class MemberService {

    reduceMembersLSB(inputMembers: Member[]): { year: number, women: number, total: number }[] {
        let result: { year: number, women: number, total: number }[] = [];
        if (inputMembers && inputMembers.length > 0) {
            const reduced: ReducedMember[] = [];
            inputMembers.forEach(mem => {
                reduced.push({
                    sex: mem.geschlecht,
                    year: (new Date(mem.geburtsdatum)).getFullYear()
                });
            });
            reduced.sort((a: ReducedMember, b: ReducedMember) => a.year - b.year);
            const redux: MemberReducer = new MemberReducer();
            const tmpResult: Accumulator = reduced.reduce(redux.reduce.bind(redux), { current: null, result: [] });
            if (tmpResult.current) {
                tmpResult.result.push(tmpResult.current);
            }
            result = tmpResult.result;
        }
        return result;
    }
}
