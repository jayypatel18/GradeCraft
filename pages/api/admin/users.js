import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Check if user is admin
  if (!session.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Forbidden - Admin access required' });
  }

  await dbConnect();

  try {
    // Get all users
    const users = await User.find({})
      .select('name email isAdmin createdAt')
      .sort({ name: 1 });
    
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}