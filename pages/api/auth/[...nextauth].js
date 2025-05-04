import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import dbConnect from '../../../utils/dbConnect';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await user.matchPassword(credentials.password);
        if (!isValid) return null;

        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email,
          isAdmin: user.isAdmin // Include isAdmin field
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin; // Add isAdmin to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin; // Add isAdmin to session
      return session;
    },
  },
  // ... other nextAuth options
};

export default NextAuth(authOptions);