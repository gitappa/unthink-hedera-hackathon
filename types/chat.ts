export interface MessageType {
    type: 'user' | 'assistant';
    content: string;
    assistantId: string; // Keep track of which assistant replied
    isLoading?: boolean; // Optional flag for loading/streaming state
}