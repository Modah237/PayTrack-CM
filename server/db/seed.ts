/**
 * PayTrack CM — Demo Seed
 * Scénarios réalistes : PMEs camerounaises, factures mixtes, paiements MoMo,
 * relances WhatsApp graduées (cordial → ferme → urgent → mise en demeure)
 */
import { db } from './index';
import bcrypt from 'bcryptjs';

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

// ─── Main seed ───────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 PayTrack CM — Démarrage du seed de démonstration...\n');

  // ── 1. Utilisateur démo ──────────────────────────────────────────────────
  const email = 'demo@paytrack.cm';
  const password = 'demo1234';
  const hash = await bcrypt.hash(password, 10);

  const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.length > 0) {
    console.log('ℹ️  Utilisateur démo déjà présent — skip utilisateur.');
  } else {
    await db.query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)`,
      [email, hash, 'Jean-Baptiste Nguema', 'manager']
    );
    console.log(`✅ Utilisateur créé : ${email} / ${password}`);
  }

  // ── 2. Clients ─────────────────────────────────────────────────────────
  // 6 PMEs camerounaises dans des secteurs variés
  const clients = [
    {
      name: 'Bâtir Cameroun SARL',
      email: 'contact@batircameroun.cm',
      phone: '+237691234501',
      sector: 'BTP',
      credit_score: 72,
      debtor_rating: 'reliable',
      avg_payment_delay: 18,
    },
    {
      name: 'Marché Central Import-Export',
      email: 'direction@mcie.cm',
      phone: '+237677890123',
      sector: 'Commerce général',
      credit_score: 45,
      debtor_rating: 'risky',
      avg_payment_delay: 47,
    },
    {
      name: 'Resto Saveurs d\'Afrique',
      email: 'restosaveurs@gmail.com',
      phone: '+237655012345',
      sector: 'Restauration',
      credit_score: 88,
      debtor_rating: 'excellent',
      avg_payment_delay: 5,
    },
    {
      name: 'Imprimerie Moderne Yaoundé',
      email: 'impy.print@yahoo.fr',
      phone: '+237699456789',
      sector: 'Imprimerie & Communication',
      credit_score: 58,
      debtor_rating: 'average',
      avg_payment_delay: 32,
    },
    {
      name: 'TransLog Cameroun',
      email: 'ops@translogcm.cm',
      phone: '+237670123456',
      sector: 'Transport & Logistique',
      credit_score: 31,
      debtor_rating: 'critical',
      avg_payment_delay: 74,
    },
    {
      name: 'EduTech Solutions CM',
      email: 'billing@edutechcm.com',
      phone: '+237696789012',
      sector: 'Technologies & Formation',
      credit_score: 91,
      debtor_rating: 'excellent',
      avg_payment_delay: 3,
    },
  ];

  const clientIds: string[] = [];
  for (const c of clients) {
    const { rows: ex } = await db.query('SELECT id FROM clients WHERE phone = $1', [c.phone]);
    if (ex.length > 0) {
      clientIds.push(ex[0].id);
      console.log(`ℹ️  Client déjà présent : ${c.name}`);
    } else {
      const { rows } = await db.query(
        `INSERT INTO clients (name, email, phone, sector, credit_score, debtor_rating, avg_payment_delay)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [c.name, c.email, c.phone, c.sector, c.credit_score, c.debtor_rating, c.avg_payment_delay]
      );
      clientIds.push(rows[0].id);
      console.log(`✅ Client créé : ${c.name}`);
    }
  }

  const [batir, marche, resto, imprimerie, translog, edutech] = clientIds;

  // ── 3. Factures ─────────────────────────────────────────────────────────
  /**
   * Scénarios couverts :
   * - Payée intégralement (via MoMo)
   * - Partiellement payée
   * - En retard court (< 30j)
   * - En retard long (> 60j, plusieurs relances)
   * - En attente (due date dans le futur)
   * - Contentieux (> 90j, mise en demeure envoyée)
   */
  const invoices = [
    // Bâtir Cameroun — payée
    {
      invoice_number: 'INV-2025-001',
      client_id: batir,
      amount: 850000,
      paid_amount: 850000,
      due_date: daysAgo(45),
      status: 'paid',
      description: 'Fourniture de matériaux de construction Q3 2025',
    },
    // Bâtir Cameroun — en attente (future)
    {
      invoice_number: 'INV-2026-011',
      client_id: batir,
      amount: 1200000,
      paid_amount: 0,
      due_date: daysFromNow(22),
      status: 'pending',
      description: 'Supervision chantier résidentiel Bonapriso — Tranche 1',
    },
    // Marché Central — en retard critique (63 jours)
    {
      invoice_number: 'INV-2025-007',
      client_id: marche,
      amount: 2450000,
      paid_amount: 0,
      due_date: daysAgo(63),
      status: 'overdue',
      description: 'Livraison marchandises importées — Container 40HC #CM2025-88',
    },
    // Marché Central — partiellement payée
    {
      invoice_number: 'INV-2025-009',
      client_id: marche,
      amount: 780000,
      paid_amount: 300000,
      due_date: daysAgo(28),
      status: 'partially_paid',
      description: 'Prestation conseil douane & formalités export',
    },
    // Resto Saveurs — payée rapidement
    {
      invoice_number: 'INV-2026-003',
      client_id: resto,
      amount: 125000,
      paid_amount: 125000,
      due_date: daysAgo(12),
      status: 'paid',
      description: 'Abonnement mensuel logiciel caisse & inventaire',
    },
    // Imprimerie — en retard moyen (38 jours)
    {
      invoice_number: 'INV-2025-014',
      client_id: imprimerie,
      amount: 430000,
      paid_amount: 0,
      due_date: daysAgo(38),
      status: 'overdue',
      description: 'Impression 5000 flyers + 200 kakémonos campagne Noël',
    },
    // TransLog — contentieux (92 jours, critique)
    {
      invoice_number: 'INV-2025-002',
      client_id: translog,
      amount: 3800000,
      paid_amount: 500000,
      due_date: daysAgo(92),
      status: 'overdue',
      description: 'Transport et logistique — 14 rotations Douala-Yaoundé Oct 2025',
    },
    // EduTech — en attente (future)
    {
      invoice_number: 'INV-2026-008',
      client_id: edutech,
      amount: 650000,
      paid_amount: 0,
      due_date: daysFromNow(14),
      status: 'pending',
      description: 'Formation Excel avancé + Power BI — 25 stagiaires',
    },
    // EduTech — payée
    {
      invoice_number: 'INV-2026-005',
      client_id: edutech,
      amount: 950000,
      paid_amount: 950000,
      due_date: daysAgo(8),
      status: 'paid',
      description: 'Développement application mobile PME — Module 1',
    },
  ];

  const invoiceIds: Record<string, string> = {};
  for (const inv of invoices) {
    const { rows: ex } = await db.query(
      'SELECT id FROM invoices WHERE invoice_number = $1', [inv.invoice_number]
    );
    if (ex.length > 0) {
      invoiceIds[inv.invoice_number] = ex[0].id;
      console.log(`ℹ️  Facture déjà présente : ${inv.invoice_number}`);
    } else {
      const { rows } = await db.query(
        `INSERT INTO invoices (invoice_number, client_id, amount, paid_amount, due_date, status, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [inv.invoice_number, inv.client_id, inv.amount, inv.paid_amount,
         inv.due_date, inv.status, inv.description]
      );
      invoiceIds[inv.invoice_number] = rows[0].id;
      console.log(`✅ Facture créée : ${inv.invoice_number} (${inv.status})`);
    }
  }

  // ── 4. Paiements ────────────────────────────────────────────────────────
  const payments = [
    // Bâtir Cameroun — paiement MoMo MTN intégral
    {
      invoice_number: 'INV-2025-001',
      amount: 850000,
      method: 'momo_mtn',
      transaction_ref: 'MTN-CM-20251101-88234',
      date: daysAgo(44),
    },
    // Resto Saveurs — paiement Orange Money rapide
    {
      invoice_number: 'INV-2026-003',
      amount: 125000,
      method: 'momo_orange',
      transaction_ref: 'OM-20260402-55891',
      date: daysAgo(11),
    },
    // Marché Central — acompte partiel par virement
    {
      invoice_number: 'INV-2025-009',
      amount: 300000,
      method: 'card',
      transaction_ref: 'VIR-UBA-20260316-11042',
      date: daysAgo(26),
    },
    // TransLog — premier acompte en cash
    {
      invoice_number: 'INV-2025-002',
      amount: 500000,
      method: 'cash',
      transaction_ref: 'CASH-TL-20260110-001',
      date: daysAgo(88),
    },
    // EduTech — paiement MoMo Orange intégral
    {
      invoice_number: 'INV-2026-005',
      amount: 950000,
      method: 'momo_orange',
      transaction_ref: 'OM-20260406-77123',
      date: daysAgo(7),
    },
  ];

  for (const p of payments) {
    const invId = invoiceIds[p.invoice_number];
    if (!invId) continue;
    const { rows: ex } = await db.query(
      'SELECT id FROM payments WHERE transaction_ref = $1', [p.transaction_ref]
    );
    if (ex.length > 0) {
      console.log(`ℹ️  Paiement déjà présent : ${p.transaction_ref}`);
    } else {
      await db.query(
        `INSERT INTO payments (invoice_id, amount, method, transaction_ref, date, reconciled)
         VALUES ($1,$2,$3,$4,$5, true)`,
        [invId, p.amount, p.method, p.transaction_ref, p.date]
      );
      console.log(`✅ Paiement créé : ${p.transaction_ref} (${p.method})`);
    }
  }

  // ── 5. Relances ─────────────────────────────────────────────────────────
  /**
   * Escalade réaliste :
   * - J+7  → cordial (rappel poli)
   * - J+30 → ferme (ton professionnel)
   * - J+60 → urgent (dernière chance)
   * - J+90 → legal (mise en demeure)
   */
  const reminders = [
    // Marché Central INV-2025-007 — escalade complète (63 jours de retard)
    {
      invoice_number: 'INV-2025-007',
      channel: 'whatsapp',
      tone: 'cordial',
      status: 'delivered',
      message: 'Bonjour M. Tchoupo, j\'espère que vous allez bien. Je me permets de vous rappeler que la facture INV-2025-007 d\'un montant de 2 450 000 XAF est arrivée à échéance le ' + daysAgo(63) + '. Nous restons disponibles pour tout arrangement. Merci de votre confiance.',
      sent_at: daysAgo(56),
    },
    {
      invoice_number: 'INV-2025-007',
      channel: 'whatsapp',
      tone: 'firm',
      status: 'read',
      message: 'Bonjour M. Tchoupo. Suite à notre précédent message, la facture INV-2025-007 de 2 450 000 XAF demeure impayée depuis 30 jours. Nous vous demandons de régulariser cette situation dans les 7 jours ouvrés. Un lien de paiement MoMo est disponible sur demande.',
      sent_at: daysAgo(33),
    },
    {
      invoice_number: 'INV-2025-007',
      channel: 'whatsapp',
      tone: 'urgent',
      status: 'sent',
      message: '⚠️ URGENT — Facture INV-2025-007 impayée depuis 60 jours (2 450 000 XAF). Sans règlement sous 48h, nous serons contraints d\'engager une procédure de recouvrement judiciaire. Réglez via le lien MoMo ci-joint ou contactez-nous immédiatement.',
      sent_at: daysAgo(3),
    },
    // TransLog INV-2025-002 — mise en demeure (92 jours)
    {
      invoice_number: 'INV-2025-002',
      channel: 'whatsapp',
      tone: 'cordial',
      status: 'delivered',
      message: 'Bonjour Mme Eyinga. La facture INV-2025-002 (3 800 000 XAF, solde restant : 3 300 000 XAF) est échue depuis 7 jours. Merci de nous faire parvenir un calendrier de règlement.',
      sent_at: daysAgo(85),
    },
    {
      invoice_number: 'INV-2025-002',
      channel: 'sms',
      tone: 'firm',
      status: 'delivered',
      message: 'PayTrack CM : Rappel facture INV-2025-002, solde 3.300.000 XAF en retard de 30j. Régularisez sous 7j ou contactez-nous au +237691000001. Réf: TL-2025-02',
      sent_at: daysAgo(62),
    },
    {
      invoice_number: 'INV-2025-002',
      channel: 'whatsapp',
      tone: 'legal',
      status: 'delivered',
      message: '📋 MISE EN DEMEURE — TransLog Cameroun est formellement mis en demeure de régler la somme de 3 300 000 XAF (facture INV-2025-002) dans un délai de 8 jours. Passé ce délai, un dossier sera transmis à notre conseil juridique conformément à l\'article 73 de l\'OHADA.',
      sent_at: daysAgo(2),
    },
    // Imprimerie INV-2025-014 — relance cordiale puis ferme
    {
      invoice_number: 'INV-2025-014',
      channel: 'whatsapp',
      tone: 'cordial',
      status: 'read',
      message: 'Bonjour M. Nkoa, j\'espère que votre campagne s\'est bien déroulée ! La facture INV-2025-014 de 430 000 XAF est arrivée à échéance le ' + daysAgo(38) + '. Merci de nous informer de la date de règlement prévue.',
      sent_at: daysAgo(31),
    },
    {
      invoice_number: 'INV-2025-014',
      channel: 'whatsapp',
      tone: 'firm',
      status: 'sent',
      message: 'Bonjour M. Nkoa. Malgré notre relance du ' + daysAgo(31) + ', la facture INV-2025-014 (430 000 XAF) reste impayée. Nous vous demandons de régulariser avant le ' + daysFromNow(5) + '. Lien Orange Money disponible sur demande.',
      sent_at: daysAgo(1),
    },
  ];

  for (const r of reminders) {
    const invId = invoiceIds[r.invoice_number];
    if (!invId) continue;
    const { rows: ex } = await db.query(
      `SELECT id FROM reminders WHERE invoice_id = $1 AND tone = $2 AND sent_at::date = $3`,
      [invId, r.tone, r.sent_at]
    );
    if (ex.length > 0) {
      console.log(`ℹ️  Relance déjà présente : ${r.invoice_number} (${r.tone})`);
    } else {
      await db.query(
        `INSERT INTO reminders (invoice_id, channel, tone, message, status, sent_at)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [invId, r.channel, r.tone, r.message, r.status, r.sent_at]
      );
      console.log(`✅ Relance créée : ${r.invoice_number} — ton ${r.tone} (${r.channel})`);
    }
  }

  // ── Résumé ───────────────────────────────────────────────────────────────
  const totalReceivable = invoices
    .filter(i => i.status !== 'paid')
    .reduce((s, i) => s + (i.amount - i.paid_amount), 0);

  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);

  console.log('\n─────────────────────────────────────────');
  console.log('📊 Résumé du scénario de démo :');
  console.log(`   👤 Utilisateur  : demo@paytrack.cm / demo1234`);
  console.log(`   🏢 Clients      : ${clients.length} PMEs`);
  console.log(`   🧾 Factures     : ${invoices.length} (paid/overdue/pending/partial)`);
  console.log(`   💳 Paiements    : ${payments.length} transactions`);
  console.log(`   📲 Relances     : ${reminders.length} messages WhatsApp/SMS`);
  console.log(`   💰 À recouvrer  : ${totalReceivable.toLocaleString()} XAF`);
  console.log(`   ✅ Encaissé     : ${totalPaid.toLocaleString()} XAF`);
  console.log('─────────────────────────────────────────\n');

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Erreur seed :', err);
  process.exit(1);
});
