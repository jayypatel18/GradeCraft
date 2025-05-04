import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { operation } = req.query;

  // Connect to database
  await dbConnect();

  // Get user session for authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const results = await Result.find({ user: session.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: results });

      case 'POST':
        const result = new Result({
          user: session.user.id,
          ...req.body,
        });
        await result.save();
        return res.status(201).json({ success: true, data: result });

      case 'DELETE':
        const { id } = req.query;
        await Result.findOneAndDelete({ _id: id, user: session.user.id });
        return res.status(200).json({ success: true });

      case 'PUT':
        if (operation === 'update') {
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
              ru: ru ? parseFloat(ru) : undefined,
              lpw: lpw ? parseFloat(lpw) : undefined,
              hasLPW: Boolean(hasLPW)
            },
            { new: true, runValidators: true }
          );

          return res.status(200).json({
            success: true,
            data: updatedResult
          });
        }
        return res.status(405).json({ success: false, message: `Operation ${operation} not allowed` });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}