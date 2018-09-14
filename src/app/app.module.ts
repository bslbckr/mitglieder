import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { DataServiceImpl } from './data.service.impl';
import { MemberService } from './app.member.service';

import { AppComponent } from './app.component';
import { OverviewComponent } from './app.overview.component';
import { MemberDetailComponent } from './app.member.detail.component';
import { MemberEditComponent } from './app.member.edit.component';
import { LsbComponent } from './lsb.component';
import { AddMemberComponent } from './app.addmember.component';
import { ViewRefDirective } from './app.viewref.directiv';
import { TestComponent } from './app.test.component';

const routes: Routes = [
    { path: 'member/:id/edit', component: MemberEditComponent },
    { path: 'member/:id', component: MemberDetailComponent },
    { path: 'lsb', component: LsbComponent },
    { path: '', component: OverviewComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        OverviewComponent,
        MemberDetailComponent,
        MemberEditComponent,
        LsbComponent,
        AddMemberComponent,
        ViewRefDirective,
        TestComponent
    ],
    entryComponents: [TestComponent],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [{ provide: DataService, useClass: DataServiceImpl }, MemberService],
    bootstrap: [AppComponent]
})
export class AppModule { }
