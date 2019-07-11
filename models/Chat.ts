import { PrometheusAlertWebhook } from "../interfaces/PrometheusAlertWebhook";
import { Alert } from "./Alert";
import { ChatMessage } from "../interfaces/ChatMessage";
import { Channel } from "../interfaces/Channel"
import { PrometheusAlert } from "../interfaces/PrometheusAlert";
const rp = require('request-promise');

export class Chat {
    chatMessage: ChatMessage;


    constructor(private prometheusAlert: PrometheusAlertWebhook, private channel: Channel) {
        this.build();
    }

    build() {
        this.chatMessage = {
            cards: [
                {
                    header: {
                        title: this.channel.title,
                        subtitle: this.channel.subtitle,
                        imageUrl: this.channel.logo
                    },
                    sections: this.prometheusAlert.alerts.filter(this.filter.bind(this)).map(o => new Alert(o).chatAlert)
                }
            ]
        }
    }

    filter(obj: PrometheusAlert) {
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

    async send() {
        let options = {
            uri: this.channel.webhook,
            method: 'POST',
            body: this.chatMessage,
            json: true
        };

        try {
            await rp(options);
        } catch (e) {
            console.error(e)
        }
    }
}