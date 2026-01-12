export const INTERAKT_API_KEY = "Q2Z5bmZGOTBmZ2ozYlo5NUowOEJmcU5NaWpWa0tKVF9ibU0zSnctVHZMVTo=";

export const TEMPLATES = {
    BUY_GOLD: 'booking_confirmation1',
    TRANSFER_GOLD: 'recieved_gold',
    DELIVERY_GOLD: 'deliverycom',
    COPY_OF_BOOKED_FOR: 'copy_of_booked_for',
    PAYMENT_VAULT: 'payment_vault',
};


interface InteraktTemplatePayload {
    countryCode: string;
    phoneNumber: string;
    callbackData?: string;
    type: string;
    template: {
        name: string;
        languageCode: string;
        bodyValues?: string[]; 
        headerValues?: string[];
    }
}

/**
 * @param fullPhoneNumber 
 * @param templateName 
 * @param bodyValues 
 */
export async function sendWhatsAppConfirmation(
    fullPhoneNumber: string,
    templateName: string,
    bodyValues: string[] = []
): Promise<any> {
    const url = 'https://api.interakt.ai/v1/public/message/';
    let cleanNumber = fullPhoneNumber.replace('+', '').replace(/\s/g, '');
    if (cleanNumber.length === 10) {
        cleanNumber = '91' + cleanNumber;
    }
    const countryCode = cleanNumber.substring(0, 2);
    const phoneNumber = cleanNumber.substring(2);

    const payload: InteraktTemplatePayload = {
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        type: "Template",
        template: {
            name: templateName,
            languageCode: "en",
            ...(bodyValues && bodyValues.length > 0 ? { bodyValues } : {})
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${INTERAKT_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Interakt API Error:", data);
            throw new Error(data.message || 'Failed to send WhatsApp message');
        }

        console.log("Interakt Success:", data);
        return data;

    } catch (error) {
        console.error("Interakt Service Error:", error);
        throw error;
    }
}
