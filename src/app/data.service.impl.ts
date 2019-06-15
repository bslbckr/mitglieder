import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './data.service';
import { MemberOverview } from './model/member-overview';
import { Member } from './model/member';
import { environment } from '../environments/environment';

@Injectable()
export class DataServiceImpl extends DataService {

    constructor(private http: HttpClient) { super(); }

    getMembers(): Promise<MemberOverview[]> {
        return this.http.get<MemberOverview[]>(
            environment.postgrestUrl + '/akt_mitglieder?select=id,vorname,name,geschlecht,status,email,geburtsdatum')
            .toPromise();

    }

    getMemberDetails(id: string): Promise<Member> {
        return this.http.get<Member[]>(
            environment.postgrestUrl + '/akt_mitglieder?id=eq.' + id)
            .toPromise()
            .then(result => {
                if (result && result.length === 1) {
                    return Promise.resolve(result[0]);
                } else {
                    let message: string;
                    message = !result || result.length === 0 ?
                        'did not receive any data' :
                        'result was ambiguous, returned array contained more than one entry';
                    return Promise.reject(message);
                }
            });
    }

    sendMemberUpdateMails(members: Member[]): Promise<string[]> {
        const mailJetUrl = environment.mailjetEndpoint;
        let payload: any = {
            Messages: [],
            SandboxMode: true
        };
        const result: string[] = [];
        if (members) {
            let count = 0;
            members.forEach(
                (mem, index, ar) => {
                    count++;
                    payload.Messages.push(this.createMailjetMessage(mem));
                    if (count === 49) {
                        count = 0;
                        result.push(JSON.stringify(payload));
                        payload = { Messages: [], SandboxMode: true };
                    }
                });
            result.push(JSON.stringify(payload));

            return Promise.resolve(result);

        } else {
            throw new Error('parameter members must not be null.');
        }
    }


    saveMemberDfv(changeMember: Member, refDate: string): Promise<boolean> {
        const insertedRow: DFVRow = {
            id: changeMember.id,
            dfvnummer: changeMember.dfvnummer,
            dse: changeMember.dse,
            rabatt: changeMember.rabatt,
            gueltig_ab: refDate
        };
        const updateUrl = `${environment.postgrestUrl}/dfv`;
        return this.postJsonToURL(insertedRow, updateUrl);
    }

    saveMemberContact(changedMember: Member, refDate: string): Promise<boolean> {
        const insertedRow: ContactRow = {
            id: changedMember.id,
            strasse: changedMember.strasse,
            plz: changedMember.plz,
            ort: changedMember.ort,
            mobil: changedMember.mobil,
            festnetz: changedMember.festnetz,
            email: changedMember.email,
            verteiler: changedMember.verteiler,
            gueltig_ab: refDate
        };
        const updateurl = `${environment.postgrestUrl}/kontaktdaten`;
        return this.postJsonToURL(insertedRow, updateurl);
    }

    saveMemberStatus(changedMember: Member, refDate: string): Promise<boolean> {
        const insertedRow: StatusRow = {
            id: changedMember.id,
            status: changedMember.status,
            gueltig_ab: refDate
        };
        const updateUrl = `${environment.postgrestUrl}/status`;
        return this.postJsonToURL(insertedRow, updateUrl);
    }

    saveMember(newMember: Member): Promise<boolean> {
        const insertUrl = `${environment.postgrestUrl}/stammdaten`;
        const insertedMember = {
            vorname: newMember.vorname,
            name: newMember.name,
            geburtsdatum: newMember.geburtsdatum,
            eintrittsdatum: newMember.eintrittsdatum,
            geschlecht: newMember.geschlecht
        };
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-type', 'application/json');
        headers.append('Prefer', 'return=representation');
        return this.http.post<{ id?: number }>(insertUrl, insertedMember, { headers: headers })
            .toPromise()
            .then(s => {
                newMember.id = s[0].id;
                return Promise.all([this.saveMemberContact(newMember, newMember.eintrittsdatum),
                this.saveMemberDfv(newMember, newMember.eintrittsdatum),
                this.saveMemberStatus(newMember, newMember.eintrittsdatum)])
                    .then(v => {
                        return Promise.resolve(v[0] && v[1] && v[2]);
                    });
            });
    }

    private postJsonToURL(payload: DFVRow | StatusRow | ContactRow, url: string): Promise<boolean> {
        const headers: HttpHeaders = new HttpHeaders();
        headers.append('Content-type', 'application/json');
        return this.http.post(url, payload, { headers: headers })
            .toPromise().then(
                /*
                  error-handling has to be done later. TODO
                res => {
                let result = false;
                if (res.status >= 200 &&
                    res.status < 300) {
                    result = true;
                } return Promise.resolve(result);
                */
                _ => true
            );

    }

    private createMailjetMessage(m: Member, templateId: number = 260084): MailjetMessage {
        if (!m.email) {
            throw new Error();
        }
        const result: MailjetMessage = {
            TemplateId: templateId,
            From: { Email: 'frisbee@goldfingers-potsdam.de', Name: 'GUC Mitgliederverwaltung' },
            To: [{
                Email: m.email,
                Name: `${m.vorname} ${m.name}`
            }],
            Subject: '',
            TemplateLanguage: true,
            Variables: {},
            TemplateErrorReporting: {
                Email: 'kaffeetrinker@gmail.com',
                Name: 'Basil'
            }
        };
        result.Subject = 'Abgleich Mitgliedsdaten';
        result.Variables['vorname'] = m.vorname;
        result.Variables['name'] = m.name;
        result.Variables['geburtsdatum'] = (new Date(m.geburtsdatum)).toLocaleDateString('de-DE');
        result.Variables['strasse'] = m.strasse;
        result.Variables['plz'] = m.plz;
        result.Variables['ort'] = m.ort;
        if (m.email) {
            result.Variables['email'] = m.email;
        }
        if (m.festnetz) {
            result.Variables['festnetz'] = m.festnetz;
        }
        if (m.mobil) {
            result.Variables['mobil'] = m.mobil;
        }
        if (m.dfvnummer) {
            result.Variables['dfvnummer'] = m.dfvnummer;
        }
        result.Variables['dse'] = m.dse ? 'liegt vor' : 'fehlt';
        result.Variables['rabatt'] = m.rabatt ? 'eingewilligt' : 'nicht gew&uuml;nscht';
        result.Variables['status'] = m.status;
        result.TemplateId = templateId;
        return result;
    }

    getMembersAtDate(refDate: Date): Promise<Member[]> {
        const contentType: HttpHeaders = new HttpHeaders();
        contentType.append('Content-type', 'application/json');
        return this.http.post<Member[]>(environment.postgrestUrl + '/rpc/func_member_at_date',
            JSON.stringify({ ref_date: refDate }),
            { headers: contentType })
            .toPromise();

    }

}

interface MailjetRecipient {
    Email: string;
    Name: string;
}
interface MailjetMessage {
    From: MailjetRecipient;
    To: MailjetRecipient[];
    Subject: string;
    TemplateId: number;
    TemplateLanguage: boolean;
    Variables: { [key: string]: string | number | boolean };
    TemplateErrorReporting?: MailjetRecipient;
}

interface DFVRow {
    id?: number;
    dfvnummer?: number;
    dse?: boolean;
    rabatt?: boolean;
    gueltig_ab: string;
}

interface StatusRow {
    id?: number;
    status: string;
    gueltig_ab: string;
}

interface ContactRow {
    id?: number;
    strasse: string;
    plz: number;
    ort: string;
    email?: string;
    mobil?: string;
    festnetz?: string;
    verteiler: boolean;
    gueltig_ab: string;
}
