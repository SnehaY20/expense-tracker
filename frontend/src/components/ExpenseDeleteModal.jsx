import React from "react";
import Spinner from "./Spinner";
import { showSuccessToast } from "../utils/toast";

const ExpenseDeleteModal = ({ show, onConfirm, onClose, deleting, selectedCount }) => {
  if (!show) return null;

  const handleConfirm = async () => {
    await onConfirm();
    showSuccessToast("Deleted successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 max-w-sm w-full">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          {selectedCount > 1 ? "Delete the selected expenses?" : "Delete the selected expense?"}
        </h2>
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center"
            onClick={handleConfirm}
            disabled={deleting}
          >
            {deleting && <Spinner size="sm" className="mr-2" />}
            {deleting ? 'Deleting...' : `Yes (${selectedCount})`}
          </button>
          <button
            className="px-6 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDeleteModal; 