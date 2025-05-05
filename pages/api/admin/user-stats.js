import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
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
    // Get total number of registered users
    const totalUsers = await User.countDocuments();
    
    // Get distinct user IDs that have created results
    const usersWithCourses = await Result.distinct('user');
    
    const stats = {
      total: totalUsers,
      withCourses: usersWithCourses.length
    };
    
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}