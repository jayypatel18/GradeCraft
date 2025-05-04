import { getServerSession } from 'next-auth/next';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (session) {
    res.status(200).json({ authenticated: true, session });
  } else {
    res.status(401).json({ authenticated: false });
  }
}