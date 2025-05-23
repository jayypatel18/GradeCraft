import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { id } = req.query;
    let result;

    // If admin, allow deleting any result
    if (session.user.isAdmin) {
      result = await Result.findByIdAndDelete(id);
    } else {
      // Regular users can only delete their own results
      result = await Result.findOneAndDelete({ _id: id, user: session.user.id });
    }

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}