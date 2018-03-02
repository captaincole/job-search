export default interface Vote {
    id?: string;
    voteOn: string;
    voteType: string;
    points: number;
    user: string;
}