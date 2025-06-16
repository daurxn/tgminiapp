import { getGlpiSessionToken } from "./glpiSession";

export async function getCurrentTicketsFromGlpi(userId: number, sessionToken: string) {
    const headers = {
        "Session-Token": sessionToken,
        "App-Token": import.meta.env.VITE_GLPI_API_TOKEN,
    }


    const params = {
        "criteria[0][field]": "4",
        "criteria[0][searchtype]": "equals",
        "criteria[0][value]": userId,
        "criteria[1][field]": "12",
        "criteria[1][searchtype]": "equals",
        "criteria[1][value]": 2,
    }

    const url = new URL("http://10.189.87.12/apirest.php/search/Ticket");

    // Add query parameters to URL
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
    });

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Ошибка при получении заявок: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return null;
    }
}

export async function getMyTicketsInProgress(userId: number) {
    return getAndSendTickets(userId, 'in_progress')
}

export async function getAndSendTickets(userId: number, status: 'in_progress' | 'done') {
    const sessionToken = await getGlpiSessionToken()

    if (status === 'in_progress') {
        const ticketRequests = getCurrentTicketsFromGlpi(userId, sessionToken)

        if ('data' in ticketRequests) {
            return ticketRequests['data']
        }
    }

    return []
}