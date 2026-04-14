import { db } from '../server/db';

async function seed() {
  console.log('🌱 Remplissage de la base de données pour le test live...');
  
  try {
    // 1. Nettoyage (Optionnel, on ajoute juste)
    console.log('--- Création des Clients ---');
    
    // Client 1
    const { rows: client1 } = await db.query(
      "INSERT INTO clients (name, phone, email, sector) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Modah Test MTN", "657565639", "test1@paytrack.cm", "Gaming"]
    );
    const c1Id = client1[0].id;
    console.log('✅ Client 1 créé (MTN)');

    // Client 2
    const { rows: client2 } = await db.query(
      "INSERT INTO clients (name, phone, email, sector) VALUES ($1, $2, $3, $4) RETURNING id",
      ["Modah Test Orange", "675397030", "test2@paytrack.cm", "Import/Export"]
    );
    const c2Id = client2[0].id;
    console.log('✅ Client 2 créé (Orange)');

    console.log('--- Création des Factures en retard ---');

    // Facture 1: Cordiale (2 jours de retard)
    const dateP1 = new Date();
    dateP1.setDate(dateP1.getDate() - 2);
    await db.query(
      "INSERT INTO invoices (invoice_number, client_id, amount, due_date, status, description, momo_link) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [`INV-TEST-001`, c1Id, 5000, dateP1, 'pending', 'Relance Cordiale Test', 'https://pay.campay.net/t/test1']
    );
    console.log('✅ Facure INV-TEST-001 créée (J-2)');

    // Facture 2: Légale (35 jours de retard)
    const dateP4 = new Date();
    dateP4.setDate(dateP4.getDate() - 35);
    await db.query(
      "INSERT INTO invoices (invoice_number, client_id, amount, due_date, status, description, momo_link) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [`INV-TEST-004`, c2Id, 150000, dateP4, 'pending', 'Relance Légale Test', 'https://pay.campay.net/t/test2']
    );
    console.log('✅ Facure INV-TEST-004 créée (J-35)');

    console.log('🚀 Base de données prête pour le test live !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de seeding:', error);
    process.exit(1);
  }
}

seed();
