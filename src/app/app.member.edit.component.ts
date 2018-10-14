import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from './model/member';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-member-edit',
    templateUrl: './app.member.edit.component.html'
})
export class MemberEditComponent implements OnInit, OnDestroy {

    private originalMember: Member;
    private subscription: Subscription;
    member: Member;
    constructor(private data: DataService, private actRoute: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.subscription = this.actRoute.paramMap.subscribe(params => {
            const paramId: string | null = params.get('id');
            if (paramId != null) {
                this.data.getMemberDetails(paramId)
                    .then(m => {
                        this.originalMember = m;
                        this.member = {} as Member;
                        this.revert();
                    });
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    revert(): void {
        for (const propKey of Object.keys(this.originalMember)) {
            this.member[propKey] = this.originalMember[propKey];
        }
    }

    get saveRequired(): boolean {
        return this.hasContactChanged() ||
            this.hasDFVChanged() ||
            this.hasStatusChanged();
    }

    save(changeDate: string): void {
        let changed = false;
        if (this.hasStatusChanged()) {
            // save changed status
            this.data.saveMemberStatus(this.member, changeDate).then(b => {
                if (b) {
                    changed = true;
                    this.navigateToMemberOverview();
                }
            });
        }
        if (this.hasDFVChanged()) {
            this.data.saveMemberDfv(this.member, changeDate).then(b => {
                if (b) {
                    changed = true;
                    this.navigateToMemberOverview();
                }
            });
        }
        if (this.hasContactChanged()) {
            // save changed contact
            this.data.saveMemberContact(this.member, changeDate).then(b => {
                if (b) {
                    changed = true;
                    this.navigateToMemberOverview();
                }
            });
        }
        if (!changed) {
            console.warn('save has been called but no changes could be detected.');
        }
    }

    private navigateToMemberOverview(): void {
        this.router.navigate(['member', this.member.id]);
    }

    private hasStatusChanged(): boolean {
        return this.member.status !== this.originalMember.status;
    }

    private hasDFVChanged(): boolean {
        return this.member.dfvnummer !== this.originalMember.dfvnummer ||
            this.member.dse !== this.originalMember.dse ||
            this.member.rabatt !== this.originalMember.rabatt;
    }

    private hasContactChanged(): boolean {
        return this.member.strasse !== this.originalMember.strasse ||
            this.member.plz !== this.originalMember.plz ||
            this.member.ort !== this.originalMember.ort ||
            this.member.festnetz !== this.originalMember.festnetz ||
            this.member.mobil !== this.originalMember.mobil ||
            this.member.email !== this.originalMember.email ||
            this.member.verteiler !== this.originalMember.verteiler;
    }
}
