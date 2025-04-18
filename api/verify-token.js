const validTokens = {
  'stage1': '583cddc7bb3cb460cde0b93979f1f324c6faa32495294fcc863ba9049361a459',
  'stage2': '583cddc7bb3cb460cde0b93979f1f324c6faa32495294fcc863ba9049361a459'
};

const sessionTokens = new Map(); // In-memory session access tokens

export default async function handler(req, res) {
  const { token, stage } = req.query;

  if (validTokens[`stage${stage - 1}`] !== token) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }

  if (parseInt(stage) === 3) {
    const generatedAccess = Math.random().toString(36).substring(2, 12);
    sessionTokens.set(generatedAccess, true);
    // Optional: Expire after 5 minutes
    setTimeout(() => sessionTokens.delete(generatedAccess), 5 * 60 * 1000);
    return res.status(200).json({ success: true, access: generatedAccess });
  }

  return res.status(200).json({ success: true });
}

export { sessionTokens };
