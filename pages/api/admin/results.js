import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if user is admin
  if (!session.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }

  await dbConnect();

  try {
    // Get all results with user information populated
    const results = await Result.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}