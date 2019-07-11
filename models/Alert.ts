import { PrometheusAlert } from "../interfaces/PrometheusAlert";
import { ChatMessageAlert } from "../interfaces/ChatMessageAlert";
const moment = require('moment');

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
                        bottomLabel: `${this.getTime(this.prometheusAlert.startsAt)} -- ${this.getTime(this.prometheusAlert.endsAt)}`
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
                        content: this.JsonToString(this.prometheusAlert.labels),
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


    getTime(utc) {
        return utc !== '0001-01-01T00:00:00Z' ? moment(utc).utc(process.env.timezone || '').format(process.env.date_format || "YYYY-MM-DD hh:mm:ss") : 'Present';
    }

    JsonToString(obj) {
        let str = '';
        for (let key in obj) {
            str += `${key}=${obj[key]} \n`
        }
        return str;
    }
}