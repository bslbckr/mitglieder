import { Component, OnInit, OnDestroy } from '@angular/core';
import { Member } from './model/member';
import { DataService } from './data.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-member-detail',
    templateUrl: './app.member.detail.component.html'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
    member: Member;
    private subscription: Subscription;
    constructor(private activeRoute: ActivatedRoute, private data: DataService) { }

    ngOnInit(): void {
        this.subscription = this.activeRoute.paramMap
            .subscribe(params => {
                const memberId: string | null = params.get('id');
                if (memberId != null) {
                    this.data.getMemberDetails(memberId)
                        .then(m => { this.member = m; });
                }
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
