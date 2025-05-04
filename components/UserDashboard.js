import { useSession, signOut } from 'next-auth/react';
import SavedResults from './SavedResults';

const UserDashboard = ({ results, onDeleteResult }) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Please sign in to view your dashboard</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Your Account</h2>
        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {session.user.name}</p>
          <p><span className="font-semibold">Email:</span> {session.user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>

      <SavedResults results={results} onDelete={onDeleteResult} />
    </div>
  );
};

export default UserDashboard;