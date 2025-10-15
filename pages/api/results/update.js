import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Connect to database
  await dbConnect();

  // Get user session for authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const { id, courseName, ct, se, as, ru, lpw, hasLPW } = req.body;

    // Find the result to be updated
    const resultToUpdate = await Result.findById(id);

    // Check if result exists
    if (!resultToUpdate) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    // Check if user is authorized (own result or admin)
    if (resultToUpdate.user.toString() !== session.user.id && !session.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update the result
    const updatedResult = await Result.findByIdAndUpdate(
      id,
      {
        courseName: courseName.trim(),
        ct: parseFloat(ct),
        se: parseFloat(se),
        as: parseFloat(as),
        ru: parseFloat(ru),
        lpw: parseFloat(lpw),
        hasLPW: Boolean(hasLPW)
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedResult
    });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}