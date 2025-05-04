import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { courseName, ct, se, as, ru, lpw, hasLPW } = req.body;
    
    const result = await Result.create({
        user: session.user.id,
        courseName: courseName.trim(), // Use the destructured variable
        ct: parseFloat(ct),
        se: parseFloat(se),
        as: parseFloat(as),
        ru: ru ? parseFloat(ru) : undefined,
        lpw: lpw ? parseFloat(lpw) : undefined,
        hasLPW: Boolean(hasLPW)
      });

    res.status(201).json({ 
      success: true, 
      data: {
        _id: result._id,
        courseName: result.courseName,
        // Include other fields you need
      }
    });
  } catch (error) {
    console.error('Save error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message,
      message: 'Failed to save results'
    });
  }
}