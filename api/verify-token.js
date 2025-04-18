export default function handler(req, res) {
  const { token } = req.query;

  // Replace this with your actual list of valid tokens
  const validTokens = [
    '583cddc7bb3cb460cde0b93979f1f324c6faa32495294fcc863ba9049361a459', // stage 1
    '583cddc7bb3cb460cde0b93979f1f324c6faa32495294fcc863ba9049361a459',
  ];

  if (!token) {
    return res.status(400).json({ success: false, message: 'Missing token' });
  }

  if (validTokens.includes(token)) {
    return res.status(200).json({ success: true, message: 'Token valid' });
  } else {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
}
