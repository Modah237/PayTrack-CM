import axios from 'axios';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'https://waba.360dialog.io/v1/messages';
const WHATSAPP_D360_API_KEY = process.env.WHATSAPP_D360_API_KEY || '';

export const getReminderMessage = (
  clientName: string,
  invoiceNo: string,
  tone: 'cordial' | 'firm' | 'urgent' | 'legal',
  momoLink: string
): string => {
  const links = momoLink ? `\n\nPayer ici : ${momoLink}` : '';
  
  switch (tone) {
    case 'cordial':
      return `Bonjour ${clientName}, c'est PayTrack. Votre facture ${invoiceNo} semble avoir été oubliée. Rien de grave, vous pouvez régulariser en un clic.${links}`;
    case 'firm':
      return `Bonjour ${clientName}, nous n'avons toujours pas reçu le règlement de la facture ${invoiceNo}. Merci de procéder au paiement dès que possible.${links}`;
    case 'urgent':
      return `ATTENTION ${clientName}, le retard de la facture ${invoiceNo} devient critique (>14j). Merci de régulariser immédiatement pour éviter toute complication.${links}`;
    case 'legal':
      return `MISE EN DEMEURE : ${clientName}, malgré nos relances, la facture ${invoiceNo} reste impayée. Sans action sous 24h, nous engagerons les procédures de recouvrement.${links}`;
    default:
      return `Rappel de paiement pour la facture ${invoiceNo}.${links}`;
  }
};

export const sendWhatsAppTemplate = async (
  toPhone: string,
  templateName: string,
  languageCode: string = 'fr',
  parameters: any[] = []
): Promise<any> => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction || !WHATSAPP_D360_API_KEY) {
    const msg = parameters.map(p => p.text).join(' ');
    console.log(`\x1b[32m[Mock WhatsApp] To: ${toPhone} | Template: ${templateName}\x1b[0m`);
    console.log(`\x1b[36m[Message Preview]:\x1b[0m ${msg}`);
    return { messages: [{ id: 'mock-msg-' + Date.now() }] };
  }

  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        to: toPhone,
        type: 'template',
        template: {
          namespace: process.env.WHATSAPP_NAMESPACE || 'paytrack_cm',
          name: templateName,
          language: {
            policy: 'deterministic',
            code: languageCode
          },
          components: [
            {
              type: 'body',
              parameters: parameters
            }
          ]
        }
      },
      {
        headers: {
          'D360-API-KEY': WHATSAPP_D360_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('WhatsApp API Error:', error?.response?.data || error);
    throw new Error('Failed to send WhatsApp message');
  }
};
