export interface ChatMessageAlert {
    widgets: Array<{
        keyValue: {
            topLabel: string;
            content: string;
            contentMultiline: boolean;
            bottomLabel?: string;
        };
    } | {
        image: {
            imageUrl: string;
        }
    }>
}