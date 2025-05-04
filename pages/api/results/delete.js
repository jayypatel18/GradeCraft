import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { id } = req.query;

    const result = await Result.findOneAndDelete({ _id: id, user: session.user.id });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}