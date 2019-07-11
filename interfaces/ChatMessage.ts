import { ChatMessageAlert } from './ChatMessageAlert'

export interface ChatMessage {
    cards: {
        header: {
            title: string;
            subtitle: string;
            imageUrl: string;
        },
        sections: ChatMessageAlert[];
    }[]
}