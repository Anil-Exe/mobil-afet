'use strict';

const express = require('express');
const admin = require('firebase-admin');
const { requireAdmin } = require('./auth');

// Credentials must be supplied by the runtime. No service-account file is bundled.
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

const authenticate = requireAdmin((token, revoked) => admin.auth().verifyIdToken(token, revoked));

app.post('/send-report-notification', authenticate, async (req, res) => {
  if (process.env.ENABLE_NOTIFICATION_DELIVERY !== 'true') {
    return res.status(503).json({ error: 'Notification delivery is disabled.' });
  }
  const { reportId, city, type } = req.body || {};
  if (![reportId, city, type].every(value => typeof value === 'string' && value.length > 0 && value.length <= 120)) {
    return res.status(400).json({ error: 'Invalid report data.' });
  }
  try {
    const snapshot = await admin.firestore().collection('users').get();
    const tokens = [...new Set(snapshot.docs.map(doc => doc.data().fcmToken)
      .filter(value => typeof value === 'string' && value.length > 0))];
    let successCount = 0;
    let failureCount = 0;
    for (let offset = 0; offset < tokens.length; offset += 500) {
      const result = await admin.messaging().sendEachForMulticast({
        notification: { title: 'Yeni Afet / Acil Durum Bildirimi', body: `${city}: ${type}` },
        data: { reportId, city, type },
        tokens: tokens.slice(offset, offset + 500),
      });
      successCount += result.successCount;
      failureCount += result.failureCount;
    }
    return res.json({ successCount, failureCount });
  } catch (_) {
    return res.status(500).json({ error: 'Notification delivery failed.' });
  }
});

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
app.listen(port, host, () => console.log('Notification service started.'));
