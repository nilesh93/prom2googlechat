import { PrometheusAlert } from "../interfaces/PrometheusAlert";
import { ChatMessageAlert } from "../interfaces/ChatMessageAlert";

const imageMap = require('../config/image-map.json')
export class Alert {

    chatAlert: ChatMessageAlert;
    constructor(private prometheusAlert: PrometheusAlert) {
        this.build();
    }

    build() {
        this.chatAlert = {
            widgets: [
                {
                    image: {
                        imageUrl: this.alertBanner
                    }
                },
                {
                    keyValue: {
                        topLabel: "Alert Name",
                        content: this.prometheusAlert.labels.alertname,
                        contentMultiline: true,
                        bottomLabel: `${this.prometheusAlert.startsAt}-${this.prometheusAlert.endsAt || 'Present'}`
                    }
                },
                {
                    keyValue: {
                        topLabel: "Message",
                        content: this.prometheusAlert.annotations.message,
                        contentMultiline: true
                    }
                },
                {
                    keyValue: {
                        topLabel: "Labels",
                        content: JSON.stringify(this.prometheusAlert.labels),
                        contentMultiline: true
                    }
                },

            ]
        }
    }

    get alertBanner() {
        if (this.prometheusAlert.status === 'firing') {
            switch (this.prometheusAlert.labels.severity) {
                case 'critical':
                    return this.getBanner('critical');
                case 'warning':
                    return this.getBanner('warning');
                default:
                    return this.getBanner('firing');
            }
        } else {
            return this.getBanner('resolved');
        }
    }

    getBanner(label) {
        return imageMap[label];
    }
}