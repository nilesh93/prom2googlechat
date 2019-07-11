import { PrometheusAlert } from './PrometheusAlert';

export interface PrometheusAlertWebhook {
    version: number;
    groupKey: string;
    status: "resolved" | "firing";
    receiver: string;
    groupLabels: { [key: string]: string }
    commonLabels: { [key: string]: string }
    commonAnnotations: { [key: string]: string }
    externalURL: string;
    alerts: PrometheusAlert[];
}
