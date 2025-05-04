import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    // Get the email from the request or use the current user's email
    const { email } = req.body;
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Find the user to promote (either by provided email or current user)
    const userEmail = email || session.user.email;
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Make the user an admin
    user.isAdmin = true;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'User is now an admin'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}