export interface MemberOverview {
    id?: number;
    vorname: string;
    name: string;
    geschlecht: 'männlich' | 'weiblich';
    status: 'passiv' | 'ermäßigt' | 'berufstätig';
    geburtsdatum: string;
    email?: string;
}
