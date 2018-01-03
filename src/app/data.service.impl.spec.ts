import { DataServiceImpl } from './data.service.impl';
import { Member } from './model/member';
import { environment } from '../environments/environment';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions,
    Http,
    Response,
    ResponseOptions,
    RequestMethod,
    XHRBackend
} from '@angular/http';


describe('Service: DataServiceImpl', () => {
    let service: DataServiceImpl;
    let mockBackend: MockBackend;
    let receivedPayload: any;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [BaseRequestOptions,
                MockBackend,
                DataServiceImpl,
                {
                    deps: [MockBackend, BaseRequestOptions],
                    provide: Http,
                    useFactory: (backend: MockBackend, defOpts: BaseRequestOptions) => { return new Http(backend, defOpts); }
                }]
        });
        const testBed = getTestBed();
        mockBackend = testBed.get(MockBackend);
        service = testBed.get(DataServiceImpl);
        receivedPayload = void 0;
    }));

    function storePayloadAndReply(conn: MockConnection): void {
        receivedPayload = JSON.parse(conn.request.getBody());
        const respOpts = new ResponseOptions({ status: 201 });
        const response = new Response(respOpts);
        conn.mockRespond(response);
    }

    function setupConnection(backend: MockBackend, requestUrl: string, method: RequestMethod): void {
        backend.connections.subscribe((conn: MockConnection) => {
            if (conn.request.url === requestUrl
                && conn.request.method === method) {
                storePayloadAndReply(conn);
            } else {
                receivedPayload = void 0;
                conn.mockRespond(new Response(new ResponseOptions(
                    { status: 405 })));
            }
        });
    }

    function buildMember(): Member {
        const result: Member = {
            id: 42,
            name: 'Test',
            vorname: 'James',
            geburtsdatum: '1970-1-2',
            eintrittsdatum: '2017-5-1',
            geschlecht: 'männlich',
            status: 'berufstätig',
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
            austrittsdatum: null
        };
        return result;
    }
    it('#saveMemberContact should post the member\'s contact data', () => {
        setupConnection(mockBackend, environment.postgrestUrl + '/kontaktdaten', RequestMethod.Post);
        service.saveMemberContact(buildMember(), '2017-12-14');
        expect(receivedPayload.gueltig_ab).toBe('2017-12-14');
        expect(receivedPayload.strasse).toBe(buildMember().strasse);
        expect(receivedPayload.plz).toBe(buildMember().plz);
        expect(receivedPayload.ort).toBe(buildMember().ort);
        expect(receivedPayload.id).toBe(buildMember().id);
        expect(receivedPayload.name).toBeUndefined();
    });

    it('#saveMemberStatus should post the member\'s status data', () => {
        setupConnection(mockBackend, environment.postgrestUrl + '/status', RequestMethod.Post);
        service.saveMemberStatus(buildMember(), '2017-12-14').then(b => { expect(b).toBeTruthy() }).catch(r => { fail(r); });
        expect(receivedPayload.gueltig_ab).toBe('2017-12-14');
        expect(receivedPayload.id).toBe(42);
        expect(receivedPayload.status).toBe('berufstätig');
        expect(receivedPayload.strasse).toBeUndefined();
        expect(receivedPayload.dfvnummer).toBeUndefined();
    });

    it('#saveMemberDfv should post the member\'s dfv data', () => {
        setupConnection(mockBackend, environment.postgrestUrl + '/dfv', RequestMethod.Post);
        service.saveMemberDfv(buildMember(), '2017-12-14');
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
