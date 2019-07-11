export interface Channel {
    logo: string;
    title: string;
    subtitle?: string;
    webhook: string;
    labels: { [key: string]: string }
}