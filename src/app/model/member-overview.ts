export interface MemberOverview {
    id?: number;
    vorname: string;
    name: string;
    geschlecht: 'm‰nnlich' | 'weiblich';
    status: 'passiv' | 'erm‰ﬂigt' | 'berufst‰tig';
    geburtsdatum: string;
    email?: string;
}
