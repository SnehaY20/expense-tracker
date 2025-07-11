import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Spinner from "./Spinner";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { updateName } from "../api/auth";

const Name = ({ user, reloadProfile }) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameUpdating, setNameUpdating] = useState(false);

  const handleNameEdit = () => {
    setEditingName(true);
    setNameInput(user?.name || "");
  };

  const handleCancel = () => {
    setEditingName(false);
    setNameInput("");
  };

  const handleNameUpdate = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!nameInput || nameInput === user?.name) return;
    setNameUpdating(true);
    try {
      await updateName(nameInput);
      showSuccessToast("Name updated successfully!");
      setEditingName(false);

    } catch (err) {
      showErrorToast(err.message || "Failed to update name");
    } finally {
      setNameUpdating(false);
    }
  };

  return (
    <div>
      <div className="text-sm text-gray-300 font-semibold mb-2">Your Name</div>
      {editingName ? (
        <div className="flex items-center gap-3">
          <Input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            className="w-48"
            disabled={nameUpdating}
          />
          <div
            className="px-4 py-2 flex items-center justify-center min-w-[90px] rounded-lg font-semibold transition bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 cursor-pointer"
            onClick={handleNameUpdate}
            style={{ 
              opacity: (nameUpdating || !nameInput || nameInput === user?.name) ? 0.5 : 1,
              cursor: (nameUpdating || !nameInput || nameInput === user?.name) ? 'not-allowed' : 'pointer'
            }}
          >
            {nameUpdating ? <Spinner size="sm" className="mr-2" /> : null}
            {nameUpdating ? "Updating..." : "Update"}
          </div>
          <Button
            type="button"
            variant="gray"
            className="px-4 py-2"
            onClick={handleCancel}
            disabled={nameUpdating}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold text-white">{user?.name || ""}</div>
          <Button
            type="button"
            className="px-4 py-2"
            onClick={handleNameEdit}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Name; 