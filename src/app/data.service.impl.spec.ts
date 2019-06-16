import { DataServiceImpl } from './data.service.impl';
import { Member } from './model/member';
import { environment } from '../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';

describe('Service: DataServiceImpl', () => {
    let service: DataServiceImpl;
    let httpController: HttpTestingController;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataServiceImpl]
        });
        const testBed = getTestBed();
        httpController = testBed.get(HttpTestingController);
        service = testBed.get(DataServiceImpl);
    }));

    function buildMember(): Member {
        const result: Member = {
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
        };
        return result;
    }
    it('#saveMemberContact should post the member\'s contact data', () => {
        service.saveMemberContact(buildMember(), '2017-12-14');
        const req = httpController.expectOne(environment.postgrestUrl + '/kontaktdaten');
        expect(req.request.method).toEqual('POST');
        req.flush({});
        httpController.verify();
        const receivedPayload = req.request.body;
        expect(receivedPayload.gueltig_ab).toBe('2017-12-14');
        expect(receivedPayload.strasse).toBe(buildMember().strasse);
        expect(receivedPayload.plz).toBe(buildMember().plz);
        expect(receivedPayload.ort).toBe(buildMember().ort);
        expect(receivedPayload.id).toBe(buildMember().id);
        expect(receivedPayload.name).toBeUndefined();
    });

    it('#saveMemberStatus should post the member\'s status data', () => {
        service.saveMemberStatus(buildMember(), '2017-12-14').then(b => { expect(b).toBeTruthy(); }).catch(r => { fail(r); });
        const req = httpController.expectOne(environment.postgrestUrl + '/status');
        expect(req.request.method).toEqual('POST');
        req.flush({});
        httpController.verify();
        const receivedPayload = req.request.body;
        expect(receivedPayload.gueltig_ab).toBe('2017-12-14');
        expect(receivedPayload.id).toBe(42);
        expect(receivedPayload.status).toBe('berufst�tig');
        expect(receivedPayload.strasse).toBeUndefined();
        expect(receivedPayload.dfvnummer).toBeUndefined();
    });

    it('#saveMemberDfv should post the member\'s dfv data', () => {
        service.saveMemberDfv(buildMember(), '2017-12-14');
        const req = httpController.expectOne(environment.postgrestUrl + '/dfv');
        expect(req.request.method).toEqual('POST');
        req.flush({});
        httpController.verify();
        const receivedPayload = req.request.body;
        expect(receivedPayload).toBeDefined();
        expect(receivedPayload.dfvnummer).toBe(123456);
        expect(receivedPayload.dse).toBe(true);
        expect(receivedPayload.rabatt).toBe(false);
        expect(receivedPayload.id).toBe(42);
        expect(receivedPayload.gueltig_ab).toBe('2017-12-14');
        expect(receivedPayload.status).toBeUndefined();
        expect(receivedPayload.email).toBeUndefined();
    });
});
