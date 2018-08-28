import { Component } from '@angular/core';
import { MemberService } from './app.member.service';
import { Member } from './model/member';
import { DataService } from './data.service';

@Component({
    selector: 'app-add-member',
    templateUrl: './app.addmember.component.html',
    styleUrls: ['./app.addmember.component.css']
})
export class AddMemberComponent {

    private isPopupVisible: boolean;
    private newMember: Member;

    constructor(private memberService: MemberService, private dataService: DataService) {
        this.isPopupVisible = false;
    }

    public get showPopup(): boolean {
        return this.isPopupVisible;
    }

    public togglePopupVisibility(): void {
        this.isPopupVisible = !this.isPopupVisible;
        if (this.isPopupVisible) {
            this.newMember = {
                vorname: 'Basil',
                name: '',
                eintrittsdatum: new Date().toDateString(),
                verteiler: true,
                geburtsdatum: '1970-01-01',
                strasse: '',
                plz: 14471,
                ort: 'Potsdam',
                geschlecht: 'weiblich',
                status: 'berufstätig'
            };
        }
    }

    public saveNewMember(): void {
        this.dataService.saveMember(this.newMember);
    }
}
