"use client";

import { useEffect, useState, useCallback } from "react";
import { Section } from "@/app/_lib/interfaces";
import { Trash2, Pencil } from "lucide-react";
import { ViewDashboardEntry } from "@/app/_lib/interfaces";
import ConfirmModal from "@/components/confirmModal";
import LoadingStatus from "@/components/loadingStatus";
import UpdateDashboardEntryModal from "@/components/addUpdateDashboardEntryModal";

export default function DashboardClient() {
  type DashboardStatus = "success" | "error" | "loading";
  //type ActiveState = "reading" | "planToRead" | "completed";

  const [active, setActive] = useState<Section>("reading");
  const [results, setResults] = useState<{
    data: ViewDashboardEntry[];
    failedEntries: boolean;
  } | null>(null);
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [confirmModalShow, setConfirmModalShow] = useState<boolean>(false);
  const [entryID, setEntryID] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [updateDashboardEntryModalShow, setUpdateDashboardEntryModalShow] =
    useState<boolean>(false);

  const navItems = [
    { key: "reading", label: "Reading" },
    { key: "planToRead", label: "Planning to read" },
    { key: "completed", label: "Completed" },
  ];

  const handleSection = useCallback(async (key: Section) => {
    setStatus("loading");

    try {
      const response: Response = await fetch("/dashboard/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section: key }),
      });
      const data: {
        validfoundDashboardEntries?: ViewDashboardEntry[];
        failedEntries?: boolean;
        error?: string;
        message?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error();
      }

      if (
        data.validfoundDashboardEntries &&
        typeof data.failedEntries === "boolean" &&
        Array.isArray(data.validfoundDashboardEntries)
      ) {
        setResults({
          data: data.validfoundDashboardEntries,
          failedEntries: data.failedEntries,
        });
      } else {
        setResults({
          data: [],
          failedEntries: false,
        });
      }

      setStatus("success");
    } catch (error: any) {
      setResults(null);
      setStatus("error");
      alert("Failed to fetch dashboard data.");
    }
  }, []);

  const handleDeletion = useCallback(
    async (entryID: string) => {
      try {
        const response = await fetch("/dashboard/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: entryID }),
        });

        if (!response.ok) {
          throw new Error();
        }

        handleSection(active); // Refresh the current section after deletion
      } catch (error: any) {
        alert("Failed to delete entry.");
      }
    },
    [active, handleSection],
  );

  const handleUpdateDashboardEntry = useCallback(
    async (
      entryID: string,
      section: Section,
      currentPage: number,
      rating: number,
    ) => {
      try {
        const response = await fetch("/dashboard/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: entryID,
            section: section,
            currentPage: currentPage,
            rating: rating,
          }),
        });

        if (!response.ok) {
          throw new Error();
        }

        handleSection(active); // Refresh the current section after update
      } catch (error: any) {
        alert("Failed to update the dashboard entry.");
      }
    },
    [active, handleSection],
  );

  useEffect(() => {
    handleSection(active);
  }, [active, handleSection]);

  const statusInfo = (entry: ViewDashboardEntry): string => {
    switch (active) {
      case "reading":
        return `Current page: ${entry.dashboardEntry.currentPage}/${entry.bookEntry.pageCount}`;
        break;
      case "planToRead":
        return "";
        break;
      case "completed":
        return `Rating: ${entry.dashboardEntry.rating}`;
        break;
      default:
        return "";
        break;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Section selection */}
      <nav className="bg-white shadow-md px-5 py-2 border border-gray-300 mt-1 mx-1 rounded-lg">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                disabled={isActive}
                onClick={() => {
                  setActive(item.key as Section);
                }}
                className={`px-4 py-2 rounded-lg transition duration-200 font-medium text-sm
                                ${
                                  isActive
                                    ? "bg-gray-500 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
              >
                {item.label}
              </button>
            );
          })}
        </ul>
      </nav>

      {/* Loading status screen */}
      {status === "loading" && <LoadingStatus />}

      {/* Content */}
      {status === "success" && (
        <div className="w-full max-w-2xl items-center flex-1/2 flex-col pt-3 mx-auto">
          {results && results.data.length > 0 ? (
            <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
              {results.data.map((entry) => (
                <div
                  key={entry.dashboardEntry.id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-1000"
                >
                  <div>
                    <h2 className="text-lg">{entry.bookEntry.name}</h2>
                    <p className="text-gray-600">{statusInfo(entry)}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      className="px-2 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-700"
                      onClick={() => {
                        setEntryID(entry.dashboardEntry.id);
                        setPageCount(entry.bookEntry.pageCount);
                        setCurrentPage(entry.dashboardEntry.currentPage);
                        setRating(entry.dashboardEntry.rating);
                        setUpdateDashboardEntryModalShow(true);
                      }}
                    >
                      <Pencil className="inline" />
                    </button>
                    <button
                      className="px-2 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-700"
                      onClick={() => {
                        setEntryID(entry.dashboardEntry.id);
                        setConfirmModalShow(true);
                      }}
                    >
                      <Trash2 className="inline" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg text-center">
              No entries in this category.
            </p>
          )}
        </div>
      )}

      {confirmModalShow && (
        <ConfirmModal
          title="Delete Entry"
          message="Are you sure you want to delete this entry?"
          color="red"
          onResult={(result) => {
            setConfirmModalShow(false);
            if (result) {
              handleDeletion(entryID as string);
            }
          }}
        />
      )}

      {updateDashboardEntryModalShow && (
        <UpdateDashboardEntryModal
          title={"Update Entry"}
          currentPage={currentPage}
          rating={rating}
          section={active}
          pageCount={pageCount}
          onResultAction={(result, data) => {
            setUpdateDashboardEntryModalShow(false);
            if (result && data) {
              handleUpdateDashboardEntry(
                entryID as string,
                data.localSection,
                data.localCurrentPage,
                data.localRating,
              );
            }
          }}
        />
      )}
    </div>
  );
}
