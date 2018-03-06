export default interface Job {
    id?: string;
    title: string;
    company: string;
    source: string;
    points: number;
    companyUrl: string;
    status: string;
    companyDescription?: string;
    companyDetails?: string;
    jobSummary?: string;
    location?: string;
    votes?: Array<any>
    linkUrl?: string;
    userVote?: any;
    jobReqUrl?: any;
    interviews?: Array<any>;
}