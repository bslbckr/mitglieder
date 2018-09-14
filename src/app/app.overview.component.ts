import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataService } from './data.service';
import { MemberOverview } from './model/member-overview';
import { ComponentService } from './app.component.service';
import { ComponentServiceImpl } from './app.component.service.impl';
import { TestComponent } from './app.test.component';
import { ViewContainerRef } from '@angular/core/src/linker/view_container_ref';

@Component({
    selector: 'app-overview',
    templateUrl: './app.overview.component.html',
    providers: [{ provide: ComponentService, useClass: ComponentServiceImpl }]
})
export class OverviewComponent implements OnInit {
    members: MemberOverview[];
    messagePayload: string[];
    private unsanitizedDownloadUrl = '';

    constructor(private data: DataService, private sanitizer: DomSanitizer, resolver: ComponentFactoryResolver, cs: ComponentService) {
        cs.containerListener((ref: ViewContainerRef) => {
            var fac = resolver.resolveComponentFactory(TestComponent);
            ref.createComponent(fac);
        });

    }

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
