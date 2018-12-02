import { Component, ComponentFactoryResolver, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DataService } from './data.service';
import { MemberOverview } from './model/member-overview';
import { ComponentService } from './app.component.service';
import { ComponentServiceImpl } from './app.component.service.impl';
import { FilterService } from "./app.filter.service";
import { FilterServiceImpl } from "./app.filter.service.impl";
import { ViewContainerRef } from '@angular/core/src/linker/view_container_ref';
import { AbstractFilterDescriptor } from './filter/AbstractFilterDescriptor';
import { injectionToken } from './filter/Filter';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-overview',
    templateUrl: './app.overview.component.html',
    providers: [{ provide: ComponentService, useClass: ComponentServiceImpl },
    { provide: FilterService, useClass: FilterServiceImpl }]
})
export class OverviewComponent implements OnInit {
    members: MemberOverview[];
    messagePayload: string[];
    private unsanitizedDownloadUrl = '';
    private filterSub: Subscription;
    private unfilteredMembers: MemberOverview[];

    constructor(private data: DataService, private sanitizer: DomSanitizer, @Inject(injectionToken) private descriptors: AbstractFilterDescriptor<{}>[], private cs: ComponentService, private filterSrv: FilterService) {
        cs.containerListener((ref: ViewContainerRef) => {
            descriptors.map(d => d.ProvideComponentFactory()).forEach(fac => ref.createComponent(fac));
        });

    }

    ngOnInit(): void {
        this.data.getMembers().then(mo => {
            this.members = mo;
            this.unfilteredMembers = mo;

            if (this.members) {
                const tmpArr: string[] = ['Vorname,Name,E-Mail,Status'];
                this.members.forEach(m => {
                    tmpArr.push(`${m.vorname},${m.name},${m.email},${m.status}`);
                });
                const blob = new Blob([tmpArr.join('\n')], { type: 'text/csv' });
                this.unsanitizedDownloadUrl = URL.createObjectURL(blob);
            }
        });

        this.filterSub = this.filterSrv
            .onFilterChanged.subscribe((filterName: string) => {
                this.members = this.filterSrv.filter(this.unfilteredMembers);
            });

    }

    public ngOnDestroy(): void {
        this.filterSub.unsubscribe();
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
