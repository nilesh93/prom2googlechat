import { PrometheusAlertWebhook } from "../interfaces/PrometheusAlertWebhook";
import { Alert } from "./Alert";
import { ChatMessage } from "../interfaces/ChatMessage";
import { Channel } from "../interfaces/Channel"
import { PrometheusAlert } from "../interfaces/PrometheusAlert";
import { ChatMessageAlert } from "../interfaces/ChatMessageAlert";
const rp = require('request-promise');

export class Chat {
    alerts: ChatMessageAlert[];

    constructor(private prometheusAlert: PrometheusAlertWebhook, private channel: Channel) {
        this.build();

    }


    private wrapAlertWithHeaders(alerts: ChatMessageAlert[]) {
        return {
            cards: [
                {
                    header: {
                        title: this.channel.title,
                        subtitle: this.channel.subtitle,
                        imageUrl: this.channel.logo
                    },
                    sections: alerts
                }
            ]
        }
    }

    private build() {
        this.alerts = this.prometheusAlert.alerts
            .filter(this.filterKeys.bind(this))
            .filter(this.ignoreAlerts.bind(this))
            .map(o => new Alert(o).chatAlert);
    }

    private filterKeys(obj: PrometheusAlert) {
        if (!this.channel.labels) {
            return true;
        } else {
            let bool = true;
            for (let key in this.channel.labels) {
                bool = bool && (this.channel.labels[key] === obj.labels[key]);
            }
            return bool;
        }
    }

    private ignoreAlerts(obj: PrometheusAlert) {
        if (!this.channel.ignore_re) {
            return true;
        } else {
            let bool = true;
            for (let key in this.channel.ignore_re) {
                bool = bool && (!!this.channel.ignore_re[key].match(obj.labels[key]));
            }
            return !bool;
        }
    }

    private async sendAsGrouped() {
        return this.sendMessage(this.wrapAlertWithHeaders(this.alerts));
    }


    private async sendAsIndividual() {
        this.alerts.forEach(async alert => {
            return this.sendMessage(this.wrapAlertWithHeaders([alert]));
        })
    }

    async send() {
        if (!!this.channel.grouped) {
            return this.sendAsGrouped();
        } else {
            return this.sendAsIndividual();
        }
    }

    private async sendMessage(payload) {
        let options = {
            uri: this.channel.webhook,
            method: 'POST',
            body: payload,
            json: true
        };

        try {
            await rp(options);
        } catch (e) {
            console.error(e)
        }
    }


}