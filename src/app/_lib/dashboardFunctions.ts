import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  BookEntryInDashboard,
  Section,
  IndexEntryDashboard,
  ViewDashboardEntry,
  BookEntryInDatabase,
} from "@/app/_lib/interfaces";
import {
  checkBookIDValid,
  checkDashboardIDValid,
} from "@/app/_lib/validationFunctions";

const dashboardDir: string = path.join(
  process.cwd(),
  "src",
  "app",
  "_lib",
  "data",
  "dashboard",
);
const dashboardSectionIndexFilePath: string = path.join(
  dashboardDir,
  "dashboardSectionIndex.json",
);
const databaseDir: string = path.join(
  process.cwd(),
  "src",
  "app",
  "_lib",
  "data",
  "database",
);

export async function writeBookEntryToDashboard(
  bookID: string,
  section: Section,
  currentPage: number,
  rating: number,
  updateID?: string,
): Promise<string> {
  const id: string = updateID ?? uuidv4(); //generates random id if updateID is not provided
  const newDashboardEntry: BookEntryInDashboard = {
    id,
    bookID,
    section,
    currentPage,
    rating,
  };

  const filePath: string = path.join(dashboardDir, `${id}.json`);

  try {
    //adds the new entry to the dashboard
    await fs.writeFile(
      filePath,
      JSON.stringify(newDashboardEntry, null, 2),
      "utf-8",
    );

    //gets the current dashboardSectionIndex
    const indexContent: string = await fs.readFile(
      dashboardSectionIndexFilePath,
      "utf-8",
    );
    const indexContentJSON: IndexEntryDashboard[] = JSON.parse(indexContent);
    indexContentJSON.push({ id, bookID, section });

    //adds the new entry to the dashboardSectionIndex
    await fs.writeFile(
      dashboardSectionIndexFilePath,
      JSON.stringify(indexContentJSON, null, 2),
      "utf-8",
    );

    return "New book entry added to dashboard.";
  } catch (error: any) {
    throw new Error("Failed to add the book entry to the dashboard.");
  }
}

export async function viewDashboard(section: Section): Promise<{
  validfoundDashboardEntries: ViewDashboardEntry[];
  failedEntries: boolean;
}> {
  try {
    const indexContent: string = await fs.readFile(
      dashboardSectionIndexFilePath,
      "utf-8",
    );
    const indexContentJSON: IndexEntryDashboard[] = JSON.parse(indexContent);

    let failedEntries: boolean = false;

    //retrieves the IDs of the dashboard entries that match the section
    const matchingDashboardEntryIDs: string[] = indexContentJSON
      .filter((entry) => entry.section === section)
      .map((entry) => entry.id);

    //loads the dashboard entries that match the matchingDashboardEntryIDs
    const foundDashboardEntries: (ViewDashboardEntry | null)[] =
      await Promise.all(
        matchingDashboardEntryIDs.map(async (id) => {
          if (!(await checkDashboardIDValid(id))) {
            failedEntries = true;
            return null;
          }

          //loads dashboard entries
          const dashboardData: string = await fs.readFile(
            path.join(dashboardDir, `${id}.json`),
            "utf-8",
          );
          const dashboardEntry: BookEntryInDashboard =
            JSON.parse(dashboardData);

          if (!(await checkBookIDValid(`${dashboardEntry.bookID}`))) {
            failedEntries = true;
            return null;
          }

          //loads corresponding book entries
          const bookData: string = await fs.readFile(
            path.join(databaseDir, `${dashboardEntry.bookID}.json`),
            "utf-8",
          );
          const bookEntry: BookEntryInDatabase = JSON.parse(bookData);

          return { dashboardEntry, bookEntry };
        }),
      );

    //filters out null entries to ensure type correctness with ViewDashboardEntry[]
    const validfoundDashboardEntries: ViewDashboardEntry[] =
      foundDashboardEntries.filter((entry) => entry !== null);

    return { validfoundDashboardEntries, failedEntries: failedEntries };
  } catch (error: any) {
    throw new Error("Failed to fetch dashboard data.");
  }
}

export async function removeEntry(id: string): Promise<string> {
  try {
    const indexContent: string = await fs.readFile(
      dashboardSectionIndexFilePath,
      "utf-8",
    );
    const indexContentJSON: IndexEntryDashboard[] = JSON.parse(indexContent);

    //removes the entry from the dashboardIndex
    const updatedIndexContentJSON: IndexEntryDashboard[] =
      indexContentJSON.filter((entry) => entry.id !== id);
    await fs.writeFile(
      dashboardSectionIndexFilePath,
      JSON.stringify(updatedIndexContentJSON, null, 2),
      "utf-8",
    );

    //removes the entry from the dashboard
    await fs.rm(path.join(dashboardDir, `${id}.json`));

    return "Entry removed successfully.";
  } catch (error: any) {
    throw new Error("Failed to remove the entry.");
  }
}

//retrieves the bookID associated with the dashboard entry
export async function getBookIDFromDashboardID(
  dashboardID: string,
): Promise<string> {
  try {
    const dashboardData: string = await fs.readFile(
      path.join(dashboardDir, `${dashboardID}.json`),
      "utf-8",
    );
    const dashboardEntry: BookEntryInDashboard = JSON.parse(dashboardData);
    const bookID: string = dashboardEntry.bookID;

    return bookID;
  } catch (error) {
    throw new Error("Could not load book data.");
  }
}

export async function updateEntry(
  updateID: string,
  bookID: string,
  section: Section,
  currentPage: number,
  rating: number,
): Promise<string> {
  try {
    await removeEntry(updateID);
    await writeBookEntryToDashboard(
      bookID,
      section,
      currentPage,
      rating,
      updateID,
    );
    return "Entry updated successfully.";
  } catch (error: any) {
    throw new Error("Failed to update the entry.");
  }
}
