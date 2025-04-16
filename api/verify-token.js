// api/verify-token.js

import axios from 'axios';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) return res.status(400).json({ valid: false, error: 'No token provided' });

  try {
    const response = await axios.get(`https://publisher.linkvertise.com/api/v1/redirect/link/token/validate/${token}`);

    if (response.data.data.valid) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (err) {
    res.status(500).json({ valid: false, error: 'Verification failed' });
  }
}
