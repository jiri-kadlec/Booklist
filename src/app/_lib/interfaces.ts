import { z } from 'zod';
import { sectionSchema } from '@/app/_lib/validationFunctions';


//database related
export interface IndexEntryDatabase {
    id: string,
    name: string
}

export interface BookEntryInDatabase {
    id: string,
    name: string,
    pageCount: number
}

export interface AddBookEntryToDatabaseBody {
    name: string,
    pageCount: number
}



//dashboard related
export type Section = z.infer<typeof sectionSchema>;
export interface BookEntryInDashboard {
    id: string,
    bookID: string,
    section: Section,
    currentPage: number,
    rating: number
}

export interface IndexEntryDashboard {
    id: string,
    bookID: string,
    section: Section
}

export interface ViewDashboardEntry {
    dashboardEntry: BookEntryInDashboard,
    bookEntry: BookEntryInDatabase
}

export interface AddBookEntryToDashboardBody {
    bookID: string,
    section: Section,
    currentPage: number,
    rating: number
}

export interface UpdateBookEntryToDashboardBody {
    id: string,
    section: Section,
    currentPage: number,
    rating: number
}