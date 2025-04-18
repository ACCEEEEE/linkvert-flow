import { sessionTokens } from './verify-token';

export default function handler(req, res) {
  const { access } = req.query;
  if (sessionTokens.has(access)) {
    return res.status(200).json({ valid: true });
  }
  return res.status(403).json({ valid: false });
}
