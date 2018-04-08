import { Injectable } from '@angular/core';
import { MemberOverview } from './model/member-overview';
import { Member } from './model/member';

@Injectable()
export abstract class DataService {

    abstract getMembers(): Promise<MemberOverview[]>;

    abstract getMemberDetails(id: string): Promise<Member>;

    abstract sendMemberUpdateMails(members: Member[]): Promise<string[]>;

    abstract getMembersAtDate(r: Date): Promise<Member[]>;

    abstract saveMemberDfv(changeMember: Member, refDate: string): Promise<boolean>;
    abstract saveMemberContact(changeMember: Member, refDate: string): Promise<boolean>;

    abstract saveMemberStatus(changedMember: Member, refDate: string): Promise<boolean>;
}
