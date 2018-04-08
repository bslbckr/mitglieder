import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataService } from './data.service';
import { MemberOverview } from './model/member-overview';

@Component({
    selector: 'app-overview',
    templateUrl: './app.overview.component.html'
})
export class OverviewComponent implements OnInit {
    members: MemberOverview[];
    messagePayload: string[];
    private unsanitizedDownloadUrl = '';

    constructor(private data: DataService, private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.data.getMembers().then(mo => {
            this.members = mo;
            if (this.members) {
                const tmpArr: string[] = ['Vorname,Name,E-Mail,Status'];
                this.members.forEach(m => {
                    tmpArr.push(`${m.vorname},${m.name},${m.email},${m.status}`);
                });
                const blob = new Blob([tmpArr.join('\n')], { type: 'text/csv' });
                this.unsanitizedDownloadUrl = URL.createObjectURL(blob);
            }
        });
    }

    get downloadUrl(): string | SafeUrl {
        return this.unsanitizedDownloadUrl ?
            this.sanitizer.bypassSecurityTrustUrl(this.unsanitizedDownloadUrl) :
            this.unsanitizedDownloadUrl;
    }

    sendMails(): void {
        this.data.getMembersAtDate(new Date(2018, 1, 1)).then(m => {
            this.data.sendMemberUpdateMails(m).then(response => this.messagePayload = response);
        });
    }
}
