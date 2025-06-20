interface WebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface WebAppInitData {
  query_id?: string;
  user?: WebAppUser;
  receiver?: WebAppUser;
  chat?: {
    id: number;
    type: 'group' | 'supergroup' | 'channel';
    title: string;
  };
  start_param?: string;
  auth_date: number;
  hash: string;
}

interface ContactReceivedData {
  phone_number: string;
  // The event might provide more data, but we only need the phone number.
}

declare global {
  interface Window {
    Telegram?: { // The Telegram object may not exist when running outside the Telegram app
      WebApp: {
        ready: () => void;
        initData: string;
        initDataUnsafe: WebAppInitData;
        onEvent: (eventType: 'contact_received', eventHandler: (data: ContactReceivedData) => void) => void;
        offEvent: (eventType: 'contact_received', eventHandler: (data: ContactReceivedData) => void) => void;
        requestContact: (callback: (isShared: boolean) => void) => void;
        MainButton: {
          show: () => void;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
        };
        close: () => void;
      };
    };
  }
}
