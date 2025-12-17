import { useNavigate } from "react-router-dom";
import CreateQuizForm from "../components/CreateQuizForm.jsx";

export default function CreateQuizPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="mb-4 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          ← Back to Dashboard
        </button>
        <CreateQuizForm />
      </div>
    </div>
  );
}

