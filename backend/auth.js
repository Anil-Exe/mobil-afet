'use strict';

// Verification is injected so tests never contact a live Firebase project.
function requireAdmin(verifyIdToken) {
  if (typeof verifyIdToken !== 'function') throw new TypeError('Token verifier required');
  return async function authenticate(req, res, next) {
    const header = req.headers.authorization;
    const match = typeof header === 'string' && /^Bearer ([^\s]+)$/i.exec(header);
    if (!match) return res.status(401).json({ error: 'Authentication required.' });

    let claims;
    try {
      // true also checks revocation and disabled users.
      claims = await verifyIdToken(match[1], true);
    } catch (_) {
      return res.status(401).json({ error: 'Invalid authentication.' });
    }
    if (!claims || claims.admin !== true) {
      return res.status(403).json({ error: 'Administrator permission required.' });
    }
    req.auth = { uid: claims.uid };
    return next();
  };
}

module.exports = { requireAdmin };
