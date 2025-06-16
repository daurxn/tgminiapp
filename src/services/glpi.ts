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

export async function processPhoneNumber(phoneNumber: string): Promise<{ success: boolean, message: string, glpiUserId?: string }> {
    const sessionToken = await getGlpiSessionToken()
    if (!sessionToken) {
        return { success: false, message: "Failed to get GLPI session token" }
    }

    const { found, userInfo } = await checkPhoneInGlpi(phoneNumber, sessionToken)

    if (found && userInfo) {
        // User found in GLPI
        const glpiUserId = userInfo['2']; // Get the GLPI user ID from field '2'

        // Return success with the GLPI user ID
        return {
            success: true,
            message: "User found in GLPI system",
            glpiUserId: glpiUserId
        }
    } else {
        // User not found in GLPI
        return {
            success: false,
            message: "Phone number not found in GLPI system"
        }
    }
}

export async function checkPhoneInGlpi(phoneNumber: string, sessionToken: string) {
    const headers = {
        'Session-Token': sessionToken,
        'App-Token': import.meta.env.VITE_GLPI_API_TOKEN,
        'Content-Type': 'application/json'
    }

    // Create search criteria variants for the phone number
    const searchCriteria = generateSearchCriteria(phoneNumber);

    // Try each phone number format until we find a match
    for (const normalizedPhone of searchCriteria) {
        // Build query parameters
        const params = new URLSearchParams({
            'criteria[0][field]': '11',
            'criteria[0][searchtype]': 'contains',
            'criteria[0][value]': normalizedPhone,
            'forcedisplay[0]': '2'
        });

        try {
            // Make the API request
            const response = await fetch(`${import.meta.env.VITE_GLPI_URL}/search/User/?${params.toString()}`, {
                method: 'GET',
                headers
            });

            if (response.ok) {
                const users = await response.json();

                // Check if we found any users
                if (users.totalcount > 0) {
                    return { found: true, userInfo: users.data[0] };
                }
            }
        } catch (error) {
            console.error(`Error searching for phone ${normalizedPhone}:`, error);
            // Continue to the next phone format on error
        }
    }

    // If no match was found with any phone format
    return { found: false, userInfo: null };
}

/**
 * Создаёт список критериев для поиска номера в GLPI
 */
export function generateSearchCriteria(phoneNumber: string): string[] {
    // Remove all non-digit characters
    const baseNumber = phoneNumber.replace(/\D/g, '');
    const criteria: string[] = [];

    if (baseNumber.startsWith('7') || baseNumber.startsWith('8')) {
        // Get the last 10 digits (Russian format)
        const shortNumber = baseNumber.slice(-10);

        criteria.push(`7${shortNumber}`);
        criteria.push(`+7${shortNumber}`);
        criteria.push(`8${shortNumber}`);
        criteria.push(`8-${shortNumber.slice(0, 3)}-${shortNumber.slice(3, 6)}-${shortNumber.slice(6)}`);
        criteria.push(`+7 (${shortNumber.slice(0, 3)}) ${shortNumber.slice(3, 6)}-${shortNumber.slice(6)}`);
    }

    return criteria;
}