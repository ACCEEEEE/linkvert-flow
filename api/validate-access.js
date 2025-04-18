// api/check-access.js
import { sessionTokens } from './verify-token';

export default function handler(req, res) {
  const { access } = req.query;

  if (!access) {
    return res.status(400).json({ valid: false, message: 'Missing access token' });
  }

  const isValid = sessionTokens.has(access);

  return res.status(isValid ? 200 : 403).json({ valid: isValid });
}
