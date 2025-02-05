import { Link, Navigate } from "react-router-dom";

const PermissionDenied = () => {

    console.log('from Error = ',localStorage.getItem('user'),localStorage.getItem('loggedIn'))
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Permission Denied</h1>
      <p className="text-lg text-gray-700 mt-2">You do not have access to this page.</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default PermissionDenied;
