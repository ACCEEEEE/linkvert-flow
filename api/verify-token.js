// api/validate-access.js
import admin from 'firebase-admin';
import { sessionTokens } from './your-other-file'; // adjust as needed

// Only run once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'your-project-id',
      clientEmail: 'your-client-email',
      privateKey: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
    }),
    databaseURL: 'https://licencecheck-80ea3-default-rtdb.firebaseio.com/',
  });
}

const db = admin.database();

const validTokens = {
  'stage1': '583cddc7bb3cb460cde0b93979f1f324c6faa32495294fcc863ba9049361a459',
  'stage2': '583cddc7bb3cb460cde0b93979f1f324c6faa32495294fcc863ba9049361a459',
  'stage3': '583cddc7bb3cb460cde0b93979f1f324c6faa32495294fcc863ba9049361a459',
};

// Get HWID from headers or query
function getHWID(req) {
  return req.headers['x-hwid'] || req.query.hwid;
}

export default async function handler(req, res) {
  const { token, stage } = req.query;
  const hwid = getHWID(req);

  if (!hwid || !stage || !token) {
    return res.status(400).json({ success: false, message: 'Missing HWID, token or stage' });
  }

  const stageKey = `stage${stage}`;
  const previousStageKey = `stage${parseInt(stage) - 1}`;

  // 1. Check token validity
  if (validTokens[previousStageKey] !== token) {
    return res.status(403).json({ success: false, message: 'Invalid or mismatched token' });
  }

  // 2. Check if user already completed this stage
  const userRef = db.ref(`users/${hwid}`);
  const userData = (await userRef.once('value')).val() || {};

  if (userData[stageKey]) {
    return res.status(200).json({ success: true, message: 'Already completed' });
  }

  // 3. Ensure they completed the previous stage before this one
  if (stage !== '1' && !userData[previousStageKey]) {
    return res.status(403).json({ success: false, message: 'Previous stage not completed' });
  }

  // 4. Mark current stage as completed
  await userRef.update({
    [stageKey]: true,
    lastCompleted: stage,
    updatedAt: Date.now(),
  });

  // 5. Handle session access token on last stage
  if (stage === '3') {
    const generatedAccess = Math.random().toString(36).substring(2, 12);
    sessionTokens.set(generatedAccess, true);
    setTimeout(() => sessionTokens.delete(generatedAccess), 5 * 60 * 1000); // optional expiry

    return res.status(200).json({ success: true, access: generatedAccess });
  }

  return res.status(200).json({ success: true });
}
