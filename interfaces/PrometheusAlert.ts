export interface PrometheusAlert {
    status: "resolved" | "firing";
    labels: { [key: string]: string }
    annotations: { [key: string]: string }
    startsAt: Date;
    endsAt: Date;
    generatorURL: string;
}
