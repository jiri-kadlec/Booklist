"use client";

import { useState, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { BookEntryInDatabase } from "@/app/_lib/interfaces";
import AddBookEntryToDatabaseModal from "@/app/database/addBookEntryToDatabaseModal";
import LoadingStatus from "@/components/loadingStatus";
import AddDashboardEntryModal from "@/components/addUpdateDashboardEntryModal";

export default function DatabaseClient() {
  type SearchStatus = "waiting" | "loading" | "success" | "error";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<BookEntryInDatabase[] | null>(null);
  const [addableBooks, setAddableBooks] = useState<string[]>([]);
  const [status, setStatus] = useState<SearchStatus>("waiting");
  const [addBookModalShow, setAddBookModalShow] = useState<boolean>(false);
  const [addDashboardEntryShow, setAddDashboardEntryShow] =
    useState<boolean>(false);
  const [selectedBookID, setSelectedBookID] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);

  const handleSearch = useCallback(async () => {
    setStatus("loading");

    if (!searchTerm.trim()) {
      setResults(null);
      setStatus("waiting");
      return;
    }

    try {
      //search data
      const response: Response = await fetch("/database/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchedTerm: searchTerm }),
      });

      const data: {
        results?: BookEntryInDatabase[];
        message?: string;
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error();
      }

      if (data.results) {
        setResults(data.results);

        //check data
        const IDs: string[] = data.results.map((book) => book.id);
        const checkResponse: Response = await fetch(
          "/dashboard/book-existence",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(IDs),
          },
        );
        const checkData = await checkResponse.json();
        setAddableBooks(checkData.addableBooks || []);

        setStatus("success");
      } else {
        setResults(null);
        setStatus("success");
      }
    } catch (error: any) {
      setResults(null);
      setStatus("error");
      alert("An error occurred while searching.");
    }
  }, [searchTerm]);

  const handleAddBook = useCallback(
    async (bookName: string, pageCount: number) => {
      try {
        const response = await fetch("/database/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: bookName, pageCount: pageCount }),
        });

        if (!response.ok) {
          throw new Error();
        }

        handleSearch(); // Refresh search results after adding a book
      } catch (error: any) {
        alert("Failed to add book to database.");
      }
    },
    [handleSearch],
  );

  const handleAddDashboardEntry = useCallback(
    async (
      bookID: string,
      section: string,
      currentPage: number,
      rating: number,
    ) => {
      try {
        const response = await fetch("/dashboard/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookID: bookID,
            section: section,
            currentPage: currentPage,
            rating: rating,
          }),
        });

        if (!response.ok) {
          throw new Error();
        }

        handleSearch(); // Refresh search results after adding a book to the dashboard
      } catch (error: any) {
        alert("Failed to add book to dashboard.");
      }
    },
    [handleSearch],
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col items-center pt-3 gap-4">
      {/* Add book entry to database */}
      <button
        onClick={() => {
          setAddBookModalShow(true);
        }}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition ml-auto mr-1.5"
      >
        Add book to database
      </button>

      {/* Search */}
      <div className="w-full max-w-xl flex items-center gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search for book entires..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-gray-500 text-white px-2 py-1.5 rounded-lg hover:bg-gray-700 transition"
        >
          <Search className="inline" />
        </button>
      </div>

      {/* Loading status screen */}
      {status === "loading" && <LoadingStatus />}

      {/* Content */}
      {status === "success" && (
        <div className="w-full max-w-2xl">
          {results && results.length > 0 ? (
            <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
              {results.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-100"
                >
                  <div>
                    <h2 className="text-lg">{book.name}</h2>
                    <p className="text-gray-600">Pages: {book.pageCount}</p>
                  </div>
                  <button
                    disabled={!addableBooks.includes(book.id)}
                    onClick={() => {
                      // Button logic here
                      console.log("Book ID:", book.id); //debugging only, remove later
                      setSelectedBookID(book.id);
                      setPageCount(book.pageCount);
                      setAddDashboardEntryShow(true);
                    }}
                    className={`text-white px-2 py-1.5 rounded transition ${
                      addableBooks.includes(book.id)
                        ? "bg-gray-500 hover:bg-gray-700"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="inline" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-lg text-center">
              No books found under that name.
            </p>
          )}
        </div>
      )}

      {addBookModalShow && (
        <AddBookEntryToDatabaseModal
          onResultAction={(result, data) => {
            setAddBookModalShow(false);
            if (result && data) {
              handleAddBook(data.bookName, data.pageCount);
            }
          }}
        />
      )}

      {addDashboardEntryShow && (
        <AddDashboardEntryModal
          title={"Add Book Entry To Dashboard"}
          pageCount={pageCount}
          onResultAction={(result, data) => {
            setAddDashboardEntryShow(false);
            if (result && data) {
              handleAddDashboardEntry(
                selectedBookID,
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
