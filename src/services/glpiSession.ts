const auth_string = `${import.meta.env.VITE_GLPI_LOGIN}:${import.meta.env.VITE_GLPI_PASSWORD}`
const auth_base64 = btoa(auth_string)

export async function getGlpiSessionToken() {
    const headers = {
        'Authorization': `Basic ${auth_base64}`,
        'App-Token': import.meta.env.VITE_GLPI_API_TOKEN,
        'Content-Type': 'application/json'
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_GLPI_URL}/initSession`, {
            method: 'GET',
            headers
        });

        if (response.ok) {
            const data = await response.json();
            return data.session_token;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting GLPI session token:', error);
        return null;
    }
}