import { fakeAsync, getTestBed, TestBed, tick, ComponentFixture } from '@angular/core/testing'
import { MemberDetailComponent } from './app.member.detail.component'
import { ActivatedRoute } from '@angular/router'
import { ArrayObservable } from 'rxjs/observable/ArrayObservable'
import { DataService } from './data.service'
import { Member } from './model/member'

describe('Test MemberDetailComponent', () => {
    var component: MemberDetailComponent;
    var data = {
        getMemberDetails(id: string): Promise<Member> {
            return null
        }
    };


    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [{ provide: DataService, useValue: data },
            {
                provide: ActivatedRoute,
                useValue: {
                    paramMap: ArrayObservable.of({
                        get(name: string): string { return '42'; },
                        has(name: string): boolean { return true; }
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
            return Promise.resolve({ id: id });
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
        spyOn(data, 'getMemberDetails').and.returnValue({
            then: function(fn: (m: any) => void) {
                fn({
                    id: '42',
                    vorname: 'Test',
                    name: 'Person',
                    email: 'q@test.com',
                    status: 'passiv',
                    dse: true,
                    rabatt: false,
                    verteiler: true,
                    dfvnummer: 123456
                });
            }

        });
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
                //2nd button in button-group is the edit-button
                expect(nativeElement
                    .querySelector('div.btn-group > a:last-child')
                    .attributes['routerLink']
                    .value).toBe('edit');
                console.dir(nativeElement);
            })
            .catch(fail);
    });
});
