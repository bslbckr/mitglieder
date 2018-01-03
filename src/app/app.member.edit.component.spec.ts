import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ArrayObservable } from 'rxjs/observable/ArrayObservable'
import { MemberEditComponent } from './app.member.edit.component'
import { DataService } from './data.service'

describe('MemberEditComponent', () => {

    var component: MemberEditComponent;
    const mockedRouter = {
        navigate: function(args: any) { }
    },
        mockedActRoute = {
            paramMap: ArrayObservable.of({

                get: function(name: string): string { return '42' }
            })
        },
        mockedData = {
            getMemberDetails: function() { },
            saveMemberDfv: function() { },
            saveMemberStatus: function() { },
            saveMemberContact: function() { }
        };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MemberEditComponent],
            imports: [FormsModule],
            providers: [
                {
                    provide: Router,
                    useValue: mockedRouter
                },
                {
                    provide: ActivatedRoute,
                    useValue: mockedActRoute
                },
                {
                    provide: DataService,
                    useValue: mockedData
                }]

        }).compileComponents();
    });

    it('component created', () => {
        const fixture = getTestBed().createComponent(MemberEditComponent);
        expect(fixture.debugElement.componentInstance).toBeDefined();
    });

    function setupAndInitialize(): ComponentFixture<MemberEditComponent> {
        spyOn(mockedData, 'getMemberDetails').and.returnValue({
            then: function(fn: (any) => void) {
                fn({
                    id: '42',
                    vorname: 'Test',
                    name: 'Person',
                    dse: true,
                    rabatt: false,
                    verteiler: true,
                    email: 'q@test.de',
                    mobil: '1234/56789',
                    geburtsdatum: '1980-07-06',
                    status: 'passiv',
                    geschlecht: 'männlich',
                    eintrittsdatum: '2007-8-9'
                });
            }
        });
        spyOn(mockedData, 'saveMemberDfv').and.returnValue({
            then: function(fn: Function) { fn(true); }
        });
        spyOn(mockedData, 'saveMemberContact').and.returnValue({
            then: function(fn: Function) { fn(true); }
        });
        spyOn(mockedData, 'saveMemberStatus').and.returnValue({
            then: function(fn: Function) { fn(true); }
        });
        const fixture = getTestBed().createComponent(MemberEditComponent);
        component = fixture.debugElement.componentInstance;
        component.ngOnInit();
        return fixture;
    }

    it('component initialized', () => {
        setupAndInitialize();
        expect(component.member).toBeDefined();
        expect(mockedData.getMemberDetails).toHaveBeenCalledWith('42');
        expect(component.member.id).toBe('42');
        expect(component.member.dse).toBe(true);
        expect(component.member.name).toBe('Person');
    });

    it('component status changed', () => {
        setupAndInitialize();
        expect(component.saveRequired).toBeFalsy();
        component.member.status = 'ermäßigt';
        expect(component.saveRequired).toBeTruthy();
    });

    it('component address changed', () => {
        setupAndInitialize();
        expect(component.saveRequired).toBeFalsy();
        component.member.email = 'anders@provider.net';
        expect(component.saveRequired).toBeTruthy();
    });

    it('component dfv changed', () => {
        setupAndInitialize();
        expect(component.saveRequired).toBeFalsy();
        component.member.rabatt = true;
        expect(component.saveRequired).toBeTruthy();
    });

    it('revert changes', () => {
        setupAndInitialize();
        expect(component.saveRequired).toBeFalsy();
        component.member.eintrittsdatum = '2005-10-4';
        component.member.geschlecht = 'weiblich';
        component.member.dse = false;
        expect(component.saveRequired).toBeTruthy();
        component.revert();
        expect(component.member.dse).toBe(true);
        expect(component.member.eintrittsdatum).toBe('2007-8-9');
        expect(component.member.geschlecht).toBe('männlich');
    });

    it('save - no changes', () => {
        spyOn(mockedRouter, 'navigate').and.callThrough();
        setupAndInitialize();
        const saveDate: string = '2017-12-22';
        component.save(saveDate);
        expect(mockedData.saveMemberDfv).not.toHaveBeenCalled();
        expect(mockedData.saveMemberContact).not.toHaveBeenCalled();
        expect(mockedData.saveMemberStatus).not.toHaveBeenCalled();
        expect(mockedRouter.navigate).not.toHaveBeenCalled();
    });

    it('save- status changed', () => {
        spyOn(mockedRouter, 'navigate').and.callThrough();
        setupAndInitialize();
        const saveDate: string = '2017-12-22';
        component.member.status = 'berufstätig';
        component.save(saveDate);
        expect(mockedData.saveMemberStatus).toHaveBeenCalledWith(jasmine.anything(), saveDate);
        expect(mockedData.saveMemberDfv).not.toHaveBeenCalled();
        expect(mockedData.saveMemberContact).not.toHaveBeenCalled();
        expect(mockedRouter.navigate).toHaveBeenCalled();
    });

    it('save - contact changed', () => {
        spyOn(mockedRouter, 'navigate').and.callThrough();
        setupAndInitialize();
        const saveDate: string = '2017-12-22';
        component.member.email = 'ganz@anders.org';
        component.save(saveDate);
        expect(mockedData.saveMemberStatus).not.toHaveBeenCalled();
        expect(mockedData.saveMemberDfv).not.toHaveBeenCalled();
        expect(mockedData.saveMemberContact).toHaveBeenCalledWith(jasmine.anything(), saveDate);
        expect(mockedRouter.navigate).toHaveBeenCalled();
    });

    it('save - dfv changed', () => {
        spyOn(mockedRouter, 'navigate').and.callThrough();
        setupAndInitialize();
        const saveDate: string = '2017-12-22';
        component.member.dfvnummer = 65432;
        component.save(saveDate);
        expect(mockedData.saveMemberStatus).not.toHaveBeenCalled();
        expect(mockedData.saveMemberDfv).toHaveBeenCalledWith(jasmine.anything(), saveDate);
        expect(mockedData.saveMemberContact).not.toHaveBeenCalled();
        expect(mockedRouter.navigate).toHaveBeenCalled();
    });

    it('there should be a heading', (done) => {
        const fixture = setupAndInitialize();
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled).toBeDefined();
        fixture.whenStable()
            .then((_) => {
                expect(compiled.querySelector('h3').textContent).toBe('Bearbeiten: Test Person');
                done();
            })
            .catch(fail);
    });

    it('there should be a form', (done) => {
        const fixture = setupAndInitialize();
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        fixture.whenStable().then((_) => {
            expect(compiled.querySelector('form.form-horizontal')).not.toBeNull();
            done();
        }).catch(fail);
    });

    it('revert & save button should be initially disabled', (done) => {
        const fixture = setupAndInitialize();
        const compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        fixture.whenStable().then((_) => {
            expect(compiled.querySelector('button#memberEdit_revertButton').disabled).toBeFalsy();
            expect(compiled.querySelector('button#memberEdit_saveButton').disabled).toBeTruthy();
            done();
        }).catch(fail);
    });
});
