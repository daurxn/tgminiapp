interface TelegramWebApp {
    WebApp: {
        initDataUnsafe?: {
            user?: {
                id?: number;
                // Add other user properties as needed
            }
        };
        // The correct way to request phone based on Telegram docs
        requestPhone: () => Promise<string>;
        // For backwards compatibility, but this isn't the correct method name
        requestContact?: (callback: (contact: { phone_number?: string }) => void) => void;
        // Add event handling
        onEvent: (eventType: string, callback: (eventData?: unknown) => void) => void;
        offEvent: (eventType: string, callback: (eventData?: unknown) => void) => void;
        // Add other WebApp methods as needed
    }
}

interface Window {
    Telegram: TelegramWebApp;
}
