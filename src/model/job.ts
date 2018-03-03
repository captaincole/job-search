export default interface Job {
    id?: string;
    title: string;
    company: string;
    source: string;
    points: number;
    companyUrl: string;
    companyDescription?: string;
    companyDetails?: string;
    jobSummary?: string;
    location?: string;
    votes?: Array<any>
    linkUrl?: string;
    userVote?: any;
}