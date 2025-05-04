import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const results = await Result.find({ user: session.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}