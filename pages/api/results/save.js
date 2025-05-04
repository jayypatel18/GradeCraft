import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { courseName, ct, se, as, ru, lpw, hasLPW } = req.body;

    const result = new Result({
      user: session.user.id,
      courseName,
      ct,
      se,
      as,
      ru,
      lpw,
      hasLPW,
    });

    await result.save();

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}