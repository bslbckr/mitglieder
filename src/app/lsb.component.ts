import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { MemberService } from './app.member.service';
import { Member } from './model/member';
@Component({
    selector: 'app-lsb',
    templateUrl: './lsb.component.html'
})
export class LsbComponent implements OnInit {

    membersPerYear: { year: number, women: number, total: number }[];

    constructor(private data: DataService, private memService: MemberService) {

    }

    ngOnInit(): void {
        this.data.getMembersAtDate(new Date('2019-01-01')).then(this.callMemberService.bind(this));
    }

    private callMemberService(members: Member[]): void {
        this.membersPerYear = this.memService.reduceMembersLSB(members);
    }
}
