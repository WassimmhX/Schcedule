import { Link } from "react-router-dom"
import { AlertTriangle } from "lucide-react" // Import the warning icon

const PermissionDenied = () => {
  console.log("from Error = ", localStorage.getItem("user"), localStorage.getItem("loggedIn"))

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="text-center">
        <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold text-red-600 mb-3 font-mono">Permission Denied</h1>
        <p className="text-lg text-gray-700 mb-6">
          You do not have access to this page.
          <br />
          <span className="font-mono text-red-400"> You have to Login to proceed.</span>
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          <span className="mr-2">Go to Home Page</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default PermissionDenied

