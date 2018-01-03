import { MemberService } from './app.member.service'
import { Member } from './model/member'

describe('test MemberService', () => {
    var service: MemberService;
    const mem1: Member = buildMember('1980-1-1', 'm�nnlich');
    const mem2: Member = buildMember('1980-1-2', 'm�nnlich');
    const mem3: Member = buildMember('1980-5-5');
    const mem4: Member = buildMember('2000-12-12');
    const mem5: Member = buildMember('1990-10-3', 'm�nnlich');

    function buildMember(dob: string, sex: string = 'weiblich'): Member {
        return {
            id: 1,
            vorname: 'Test',
            name: 'Tester',
            strasse: 'Hstr 1',
            plz: 12345,
            ort: 'potsdam',
            festnetz: 'jjj',
            mobil: 'dddd',
            email: 'q@q.de',
            geschlecht: sex,
            geburtsdatum: dob,
            eintrittsdatum: '2017-12-5',
            austrittsdatum: null,
            status: 'berufst�tig',
            dfvnummer: 12345,
            dse: true,
            rabatt: true,
            verteiler: true
        };
    }

    beforeEach(() => {
        service = new MemberService();
    });

    it('array of length 1 should be easy', () => {
        var result = service.reduceMembersLSB([mem1]);
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].year).toBe(1980);
        expect(result[0].women).toBe(0);
        expect(result[0].total).toBe(1);
    });

    it('null should yield null', () => {
        var result = service.reduceMembersLSB(null);
        expect(result).toBeNull();
    });

    it('empty array should yield null', () => {
        var result = service.reduceMembersLSB([]);
        expect(result).toBeNull();
    });

    it('array of three', () => {
        var result = service.reduceMembersLSB([mem1, mem2, mem3]);
        expect(result).toBeDefined();
        expect(result.length).toBe(1); // all born in 1980
        expect(result[0].year).toBe(1980);
        expect(result[0].total).toBe(3);
        expect(result[0].women).toBe(1); //mem3 is a woman
    });

    it('different years', () => {
        var result = service.reduceMembersLSB([mem5, mem1, mem3, mem2, mem4]);
        expect(result).toBeDefined();
        expect(result.length).toBe(3); //born in 1980, 1990, and 2000
        let yearResult = result[0];
        expect(yearResult.year).toBe(1980);
        expect(yearResult.total).toBe(3);
        expect(yearResult.women).toBe(1);
        yearResult = result[1];
        expect(yearResult.year).toBe(1990);
        expect(yearResult.total).toBe(1);
        expect(yearResult.women).toBe(0);
        yearResult = result[2];
        expect(yearResult.year).toBe(2000);
        expect(yearResult.total).toBe(1);
        expect(yearResult.women).toBe(1);
    });
});
