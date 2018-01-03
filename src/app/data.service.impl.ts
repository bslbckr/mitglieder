import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http'
import { DataService } from './data.service'
import { MemberOverview } from './model/member-overview'
import { Member } from './model/member'
import { environment } from '../environments/environment'

@Injectable()
export class DataServiceImpl extends DataService {

    constructor(private http: Http) { super(); }

    getMembers(): Promise<MemberOverview[]> {
        return this.http.get(
            environment.postgrestUrl + '/akt_mitglieder?select=id,vorname,name,geschlecht,status,email')
            .toPromise()
            .then(resp => {
                return Promise.resolve(resp.json() as MemberOverview[])
            });

    }

    getMemberDetails(id: string): Promise<Member> {
        return this.http.get(
            environment.postgrestUrl + '/akt_mitglieder?id=eq.' + id)
            .toPromise()
            .then(resp => {
                var result = resp.json();
                if (result && result.length == 1) {
                    return Promise.resolve(result[0] as Member);
                } else {
                    let message: string;
                    message = !result || result.length == 0 ? 'did not receive any data' : 'result was ambiguous, returned array contained more than one entry';
                    return Promise.reject(message);
                }
            });
    }

    sendMemberUpdateMails(members: Member[]): Promise<string[]> {
        var mailJetUrl = environment.mailjetEndpoint;
        var payload = {
            Messages: [],
            SandboxMode: true
        };
        var result: string[] = [];
        if (members) {
            var count: number = 0;
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
        const updateUrl: string = `${environment.postgrestUrl}/dfv`;
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
        const updateurl: string = `${environment.postgrestUrl}/kontaktdaten`;
        return this.postJsonToURL(insertedRow, updateurl);
    }

    saveMemberStatus(changedMember: Member, refDate: string): Promise<boolean> {
        const insertedRow: StatusRow = {
            id: changedMember.id,
            status: changedMember.status,
            gueltig_ab: refDate
        };
        const updateUrl: string = `${environment.postgrestUrl}/status`;
        return this.postJsonToURL(insertedRow, updateUrl);
    }

    private postJsonToURL(payload: DFVRow | StatusRow | ContactRow, url: string): Promise<boolean> {
        var headers: Headers = new Headers();
        headers.append('Content-type', 'application/json');
        return this.http.post(url, payload, { headers: headers })
            .toPromise().then(res => {
                var result: boolean = false;
                if (res.status >= 200 &&
                    res.status < 300) {
                    result = true;
                } return Promise.resolve(result);
            });

    }

    private createMailjetMessage(m: Member, templateId: number = 260084): MailjetMessage {
        var result: MailjetMessage = {
            TemplateId: templateId,
            From: { Email: 'frisbee@goldfingers-potsdam.de', Name: 'GUC Mitgliederverwaltung' },
            To: [{
                Email: m.email,
                Name: `${m.vorname} ${m.name}`
            }],
            Subject: null,
            TemplateLanguage: true,
            Variables: {},
            TemplateErrorReporting: {
                Email: "kaffeetrinker@gmail.com",
                Name: "Basil"
            }
        };
        result.Subject = 'Abgleich Mitgliedsdaten';
        result.Variables["vorname"] = m.vorname;
        result.Variables["name"] = m.name;
        result.Variables["geburtsdatum"] = (new Date(m.geburtsdatum)).toLocaleDateString('de-DE');
        result.Variables["strasse"] = m.strasse;
        result.Variables["plz"] = m.plz;
        result.Variables["ort"] = m.ort;
        result.Variables["email"] = m.email;
        result.Variables["festnetz"] = m.festnetz;
        result.Variables["mobil"] = m.mobil;
        result.Variables["dfvnummer"] = m.dfvnummer;
        result.Variables["dse"] = m.dse ? 'liegt vor' : 'fehlt';
        result.Variables["rabatt"] = m.rabatt ? 'eingewilligt' : 'nicht gew&uuml;nscht';
        result.Variables["status"] = m.status;
        result.TemplateId = templateId;
        return result;
    }

    getMembersAtDate(refDate: Date): Promise<Member[]> {
        var contentType: Headers = new Headers();
        contentType.append('Content-type', 'application/json');
        return this.http.post(environment.postgrestUrl + '/rpc/func_member_at_date',
            JSON.stringify({ ref_date: refDate }),
            { headers: contentType })
            .toPromise()
            .then(resp => {
                return Promise.resolve(resp.json() as Member[]);
            });

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
    id: number;
    dfvnummer: number;
    dse: boolean;
    rabatt: boolean;
    gueltig_ab: string;
}

interface StatusRow {
    id: number;
    status: string;
    gueltig_ab: string;
}

interface ContactRow {
    id: number;
    strasse: string;
    plz: number;
    ort: string;
    email: string;
    mobil: string;
    festnetz: string;
    verteiler: boolean;
    gueltig_ab: string;
}
