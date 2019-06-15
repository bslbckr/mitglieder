import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { DataServiceImpl } from './data.service.impl';
import { MemberService } from './app.member.service';
import { FilterModule } from './filter/FilterModule';
import { AppComponent } from './app.component';
import { OverviewComponent } from './app.overview.component';
import { MemberDetailComponent } from './app.member.detail.component';
import { MemberEditComponent } from './app.member.edit.component';
import { LsbComponent } from './lsb.component';
import { AddMemberComponent } from './app.addmember.component';
import { ViewRefDirective } from './app.viewref.directiv';

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
        AddMemberComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        FormsModule,
        FilterModule,
        HttpClientModule
    ],
    providers: [{ provide: DataService, useClass: DataServiceImpl }, MemberService],
    bootstrap: [AppComponent]
})
export class AppModule { }
