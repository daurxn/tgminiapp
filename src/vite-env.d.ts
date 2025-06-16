/// <reference types="vite/client" />

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

interface ContactRequestedData {
  status: 'sent' | 'cancelled';
}

interface Window {
  Telegram: {
    WebApp: {
      ready: () => void;
      initData: string;
      initDataUnsafe: WebAppInitData;
      onEvent: (eventType: 'contactRequested', eventHandler: (data: ContactRequestedData) => void) => void;
      offEvent: (eventType: 'contactRequested', eventHandler: (data: ContactRequestedData) => void) => void;
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
