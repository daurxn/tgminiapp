interface TelegramWebApp {
    WebApp: {
        initDataUnsafe?: {
            user?: {
                id?: number;
                // Add other user properties as needed
            }
        };
        requestContact: (callback: (contact: {
            phone_number: string;
            first_name?: string;
            last_name?: string;
            user_id?: number;
        }) => void) => void;
        // Add other WebApp methods as needed
    }
}

interface Window {
    Telegram: TelegramWebApp;
}
