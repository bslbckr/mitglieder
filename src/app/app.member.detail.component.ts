import { Component, OnInit, OnDestroy } from '@angular/core';
import { Member } from './model/member'
import { DataService } from './data.service'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs/Subscription'

@Component({
    selector: 'member-detail',
    templateUrl: './app.member.detail.component.html'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
    member: Member;
    private subscription: Subscription;
    constructor(private activeRoute: ActivatedRoute, private data: DataService) { }

    ngOnInit(): void {
        this.subscription = this.activeRoute.paramMap
            .subscribe(params => {
                const memberId: string = params.get('id');
                this.data.getMemberDetails(memberId)
                    .then(m => { this.member = m; })
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
