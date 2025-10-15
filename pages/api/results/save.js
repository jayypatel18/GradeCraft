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
    
    // Validate that courseName exists before trying to use trim()
    if (!courseName) {
      return res.status(400).json({
        success: false,
        error: 'Course name is required',
        message: 'Course name is required'
      });
    }
    
    const result = await Result.create({
        user: session.user.id,
        courseName: courseName.trim(), // Now safe to use trim() since we've validated courseName
        ct: parseFloat(ct),
        se: parseFloat(se),
        as: parseFloat(as),
        ru: parseFloat(ru),
        lpw: parseFloat(lpw),
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