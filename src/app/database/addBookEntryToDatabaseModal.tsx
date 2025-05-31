"use client";

import { useState } from "react";

interface AddBookEntryToDatabaseModalProps {
  onResultAction: (
    result: boolean,
    data?: { bookName: string; pageCount: number },
  ) => void;
}

export default function AddBookEntryToDatabaseModal({
  onResultAction,
}: AddBookEntryToDatabaseModalProps) {
  const [bookName, setBookName] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);

  const handleConfirm = () => {
    if (bookName.trim() === "") {
      alert("Book Name cannot be empty.");
      return;
    }
    if (pageCount <= 0) {
      alert("Page Count must be a positive number.");
      return;
    }
    onResultAction(true, { bookName, pageCount });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-contrast-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-lg font-semibold mb-2">Add Book Entry</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Book Name</label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Page Count</label>
          <input
            type="number"
            value={pageCount}
            onChange={(e) => setPageCount(Number(e.target.value))}
            min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onResultAction(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
