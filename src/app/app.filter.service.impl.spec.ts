import { Member } from "./model/member";
import { FilterServiceImpl } from "./app.filter.service.impl";
import { FilterFunc } from "./app.filter.service";

describe("Service: FilterServiceImpl", () => {
    const memberInput: Member[] = [
        {
            id: 42,
            name: 'Test',
            vorname: 'James',
            geburtsdatum: '1970-1-2',
            eintrittsdatum: '2017-5-1',
            geschlecht: 'm�nnlich',
            status: 'berufst�tig',
            dfvnummer: 123456,
            dse: true,
            rabatt: false,
            strasse: 'Hauptstr. 42',
            plz: 12345,
            ort: 'Potsdam',
            festnetz: 'hat er',
            mobil: 'auch',
            verteiler: true,
            email: 'james.test@exmaple.com',
            austrittsdatum: ''
        }
    ];
    let service: FilterServiceImpl;

    beforeEach(() => { service = new FilterServiceImpl(); });
    it("the result should not be changed if no filter is set", () => {
        const result = service.filter(memberInput);
        expect(result).toBe(memberInput);
    });

    it("the all-false filter should remove any entry from the input-array", () => {
        const allFalse: FilterFunc = (i: Member) => false;
        service.registerFilter("allFalse", allFalse);
        const result = service.filter(memberInput);
        expect(result).not.toBeNaN();
        expect(result.length).toBe(0);
    });
});
