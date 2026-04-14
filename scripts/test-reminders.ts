import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 4000;
const secret = process.env.N8N_WEBHOOK_SECRET || 'dev_secret_123';

async function trigger() {
  console.log('🚀 Déclenchement manuel du moteur de relance...');
  try {
    const response = await axios.post(`http://localhost:${PORT}/api/webhooks/n8n-trigger`, {}, {
      headers: { 'x-n8n-secret': secret }
    });
    console.log('✅ Succès !');
    console.log('Résultats:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    if (error.response) {
      console.error('❌ Erreur API:', error.response.status, error.response.data);
    } else {
      console.error('❌ Erreur Connexion:', error.message);
      console.error('Astuce: Vérifiez que votre serveur est lancé sur le port', PORT);
    }
  }
}

trigger();
