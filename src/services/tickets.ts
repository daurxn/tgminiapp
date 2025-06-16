import { getGlpiSessionToken } from "./glpi";

export async function getCurrentTicketsFromGlpi(userId: string, sessionToken: string) {
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
            return await response.json() as { data: any[] };
        } else {
            console.error(`Ошибка при получении заявок: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return null;
    }
}

export async function getMyTicketsInProgress(userId: string) {
    return getAndSendTickets(userId, 'in_progress')
}

export async function getAndSendTickets(userId: string, status: 'in_progress' | 'done') {
    const sessionToken = await getGlpiSessionToken()

    if (status === 'in_progress') {
        const ticketRequestsFromGlpi = await getCurrentTicketsFromGlpi(userId, sessionToken)

        const result = []

        if (ticketRequestsFromGlpi && 'data' in ticketRequestsFromGlpi) {
            for (const req of ticketRequestsFromGlpi.data) {
                const id = req[2]
                const title = req[1]
                const close = null
                const status = req[12]
                const description = req[21]

                result.push({ id, title, close, status, description })
            }
        }

        return result
    }

    return []
}