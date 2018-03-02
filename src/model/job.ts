export default interface Job {
    id?: string;
    title: string;
    company: string;
    source: string;
    points: number;
    votes?: Array<any>
    linkUrl?: string;
    userVote?: any;
}