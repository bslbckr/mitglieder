import { fakeAsync, getTestBed, TestBed, tick, ComponentFixture } from '@angular/core/testing';
import { MemberDetailComponent } from './app.member.detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from './data.service';
import { Member } from './model/member';

interface ParameterMap {
    get(name: string): string;
    has(name: string): boolean;
}

describe('Test MemberDetailComponent', () => {
    let component: MemberDetailComponent;
    const data = {
        getMemberDetails(id: string): Promise<Member> {
            return Promise.reject('test');
        }
    };


    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [{ provide: DataService, useValue: data },
            {
                provide: ActivatedRoute,
                useValue: {
                    paramMap: of<ParameterMap>({
                        get(_: string): string { return '42'; },
                        has(_: string): boolean { return true; }
                    })
                }
            }],
            declarations: [MemberDetailComponent]
        }).compileComponents();

    });

    it('first component test', () => {
        const fixutre: ComponentFixture<MemberDetailComponent> = getTestBed().createComponent(MemberDetailComponent);
        component = fixutre.debugElement.componentInstance;
        expect(component).toBeDefined();
    });

    it('initialize component', fakeAsync(() => {
        spyOn(data, 'getMemberDetails').and.callFake((id: string) => {
            return Promise.resolve(
                {
                    id: +id,
                    vorname: 'test',
                    name: 'test',
                    eintrittsdatum: new Date().toISOString(),
                    austrittsdatum: undefined,
                    verteiler: true,
                    email: 'test',
                    strasse: 'test',
                    plz: 12345,
                    ort: 'test',
                    geschlecht: 'weiblich',
                    status: 'berufstätig',
                    geburtsdatum: new Date().toISOString()
                } as Member
            );
        });
        const fixutre: ComponentFixture<MemberDetailComponent> = getTestBed().createComponent(MemberDetailComponent);
        component = fixutre.debugElement.componentInstance;
        component.ngOnInit();
        // use tick() in cobination with fakeAsync() to let the
        // asynchronous Promises do their work
        tick();
        expect(data.getMemberDetails).toHaveBeenCalled();
        expect(component.member).toBeDefined();
    }));

    function spyOnData() {
        spyOn(data, 'getMemberDetails').and.returnValue(
            Promise.resolve({
                id: 42,
                vorname: 'Test',
                name: 'Person',
                email: 'q@test.com',
                status: 'passiv',
                dse: true,
                rabatt: false,
                verteiler: true,
                dfvnummer: 123456,
                strasse: 'test',
                plz: 1234,
                ort: 'test',
                eintrittsdatum: new Date().toISOString(),
                geburtsdatum: new Date().toISOString(),
                geschlecht: 'weiblich'
            }));
    }

    it('rendering', () => {
        spyOnData();
        const fixutre: ComponentFixture<MemberDetailComponent> =
            getTestBed().createComponent(MemberDetailComponent);
        component = fixutre.debugElement.componentInstance;
        component.ngOnInit();
        fixutre.detectChanges();
        fixutre.whenStable()
            .then((_) => {
                const nativeElement = fixutre.debugElement.nativeElement;

                expect(nativeElement.querySelector('h3').textContent)
                    .toBe('Detailansicht Test Person');
                expect(nativeElement.querySelector('div.btn-group')
                    .childElementCount).toBe(2);
                // 2nd button in button-group is the edit-button
                expect(nativeElement
                    .querySelector('div.btn-group > a:last-child')
                    .attributes['routerLink']
                    .value).toBe('edit');
                console.dir(nativeElement);
            })
            .catch(fail);
    });
});
