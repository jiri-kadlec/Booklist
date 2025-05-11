import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { IndexEntryDashboard, BookEntryInDatabase } from '@/app/_lib/interfaces'

const databaseDir: string = path.join(process.cwd(), 'src', 'app', '_lib', 'data', 'database');
const dashboardDir: string = path.join(process.cwd(), 'src', 'app', '_lib', 'data', 'dashboard');
const dashboardSectionIndexFilePath: string = path.join(dashboardDir, 'dashboardSectionIndex.json');

//Database related validation
//Validation for passed bookEntry input
const bookEntrySchema = z.object({
    name: z.string().min(1),
    pageCount: z.number().int().positive(),
});

export function validateBookEntryInput(name: unknown, pageCount: unknown): boolean {
    const result = bookEntrySchema.safeParse({ name, pageCount });
    return result.success; // Returns true if the input is valid, false otherwise
}

//Validation for passed searchedTerm input
const searchedTermSchema = z.string().min(1);
export function validateSearchedTermInput(searchedTerm: unknown): boolean {
    const result = searchedTermSchema.safeParse(searchedTerm);
    return result.success; // Returns true if the input is valid, false otherwise
}


//Dashboard related validation
//Validation for passed section input
export const sectionSchema = z.enum(['planToRead', 'reading', 'completed']);
export function validateSectionInput(section: unknown): boolean {
    const result = sectionSchema.safeParse(section);
    return result.success;
}

//Validation for passed DashboardEntry input
const dashboardEntrySchema = z.object({
    bookID: z.string().min(1),
    section: sectionSchema,
    currentPage: z.number().int().min(0),
    rating: z.number().int().min(0).max(10)
});

export function validateDashboardEntryInput(bookID: unknown, section: unknown, currentPage: unknown, rating: unknown): boolean {
    const result = dashboardEntrySchema.safeParse({ bookID, section, currentPage, rating });
    return result.success; // Returns true if the input is valid, false otherwise
}

//Validation for passed dashboardUpdateEntrySchema input
const dashboardUpdateEntrySchema = z.object({
    id: z.string().min(1),
    section: sectionSchema,
    currentPage: z.number().int().min(0),
    rating: z.number().int().min(0).max(10)
});

export function validateDashboardUpdateEntrySchema(id: unknown, section: unknown, currentPage: unknown, rating: unknown): boolean {
    const result = dashboardUpdateEntrySchema.safeParse({ id, section, currentPage, rating });
    return result.success; // Returns true if the input is valid, false otherwise
}

//checks that passed bookID has corresponding entry in data/database
export async function checkBookIDValid(bookID: string): Promise<boolean> {
    try {
        await fs.access(path.join(databaseDir, `${bookID}.json`));
        return true;
    }

    catch {
        return false;
    }
}

//checks that passed dashboardID has corresponding entry in data/dashboard
export async function checkDashboardIDValid(dashboardID: string): Promise<boolean> {
    try {
        await fs.access(path.join(dashboardDir, `${dashboardID}.json`));
        return true;
    }

    catch {
        return false;
    }
}

//checks that passed bookID does not already exist in the dashboard
export async function checkBookEntryInDashboardDoesNotExist(bookID: string): Promise<boolean> {
    try {
        const indexContent: string = await fs.readFile(dashboardSectionIndexFilePath, 'utf-8');
        const indexContentJSON: IndexEntryDashboard[] = JSON.parse(indexContent);

        if (indexContentJSON.some(entry => entry.bookID === bookID)) {
            return false; // Book entry already exists in the dashboard
        }
    }

    catch (error: any) {
        throw new Error('Error during validation.');
    }

    return true;
}

//checks that passed currentPage is not greater than the number of pages in the book
export async function checkCurrentPageValid(bookID: string, currentPage: number): Promise<boolean> {
    const bookData: string = await fs.readFile(path.join(databaseDir, `${bookID}.json`), 'utf-8');
    const bookEntry: BookEntryInDatabase = JSON.parse(bookData);

    if (currentPage <= bookEntry.pageCount) {
        return true;
    }

    return false;
}

//Validation for passed ID input
const IDSchema = z.string().min(1);
export function validateIDInput(id: unknown): boolean {
    const result = IDSchema.safeParse(id);
    return result.success; // Returns true if the input is valid, false otherwise
}