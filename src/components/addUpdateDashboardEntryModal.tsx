"use client";

import { useState, useEffect } from "react";
import { Section } from "@/app/_lib/interfaces";

interface AddUpateDashboardEntryModalProps {
  title: string;
  currentPage?: number;
  rating?: number;
  section?: Section;
  pageCount: number;
  onResultAction: (
    result: boolean,
    data?: {
      localSection: Section;
      localCurrentPage: number;
      localRating: number;
    },
  ) => void;
}

export default function AddUpateDashboardEntryModal({
  title,
  currentPage,
  rating,
  section,
  pageCount,
  onResultAction,
}: AddUpateDashboardEntryModalProps) {
  const [localCurrentPage, setLocalCurrentPage] = useState<number>(
    currentPage ?? 0,
  );
  const [localSection, setLocalSection] = useState<Section>(
    section ?? "planToRead",
  );
  const [localRating, setLocalRating] = useState<number>(rating ?? 0);

  useEffect(() => {
    setLocalCurrentPage(currentPage ?? 0);
    setLocalRating(rating ?? 0);
  }, [localSection, currentPage, rating]);

  const handleConfirm = () => {
    onResultAction(true, { localSection, localCurrentPage, localRating });
  };

  const sectionOptions = (localSection: Section) => {
    switch (localSection) {
      case "planToRead":
        return <></>;
        break;
      case "reading":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Current Page (0-{pageCount})
              </label>
              <input
                type="number"
                value={localCurrentPage}
                onChange={(e) => {
                  const value: number = Number(e.target.value);
                  if (value <= pageCount) {
                    setLocalCurrentPage(value);
                  }
                }}
                min={0}
                max={pageCount}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </>
        );
        break;
      case "completed":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Rating (0-10)
              </label>
              <input
                type="number"
                value={localRating}
                onChange={(e) => {
                  const value: number = Number(e.target.value);
                  if (value <= 10) {
                    setLocalRating(value);
                  }
                }}
                min={0}
                max={10}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </>
        );
        break;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-contrast-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Section</label>
          <select
            value={localSection}
            onChange={(e) => setLocalSection(e.target.value as Section)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
          >
            <option value="planToRead">Planning to read</option>
            <option value="reading">Reading</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {sectionOptions(localSection)}

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
