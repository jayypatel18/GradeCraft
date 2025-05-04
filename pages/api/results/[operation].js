import dbConnect from '../../../utils/dbConnect';
import Result from '../../../models/Result';
import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

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

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}