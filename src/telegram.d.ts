interface TelegramWebApp {
    WebApp: {
        initDataUnsafe?: {
            user?: {
                id?: number;
                // Add other user properties as needed
            }
        };
        requestContact: (callback: (contact: any) => void) => void;
        // Add other WebApp methods as needed
    }
}

interface Window {
    Telegram: TelegramWebApp;
}
