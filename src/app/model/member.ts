import { MemberOverview } from './member-overview';

export interface Member extends MemberOverview {
    eintrittsdatum: string;
    austrittsdatum: string;
    strasse: string;
    plz: number;
    ort: string;
    mobil: string;
    festnetz: string;
    verteiler: boolean;
    dfvnummer: number;
    dse: boolean;
    rabatt: boolean;
}
