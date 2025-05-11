import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IndexEntryDatabase, BookEntryInDatabase } from '@/app/_lib/interfaces'

//Defines database paths
const databaseDir: string = path.join(process.cwd(), 'src', 'app', '_lib', 'data', 'database');
const databaseIndexFilePath: string = path.join(databaseDir, 'databaseIndex.json');

export async function searchDatabase(searchedTerm: string): Promise<BookEntryInDatabase[]> {
    try {
        //Reads and parses the database index file
        const indexContent: string = await fs.readFile(databaseIndexFilePath, 'utf-8');
        const indexContentJSON: IndexEntryDatabase[] = JSON.parse(indexContent);

        //Filters book entries in databaseIndex by name and collects their IDs
        const matchingIDs: string[] = indexContentJSON.filter(entry => entry.name.toLowerCase().includes(searchedTerm.toLowerCase())).map(entry => entry.id);

        //In parallel loads book entries with machting IDs
        const foundBooks: BookEntryInDatabase[] = await Promise.all(matchingIDs.map(async (id) => {
            const data: string = await fs.readFile(path.join(databaseDir, `${id}.json`), 'utf-8');
            return JSON.parse(data);
        }));


        return foundBooks;
    }

    catch (error: any) {
        throw new Error('There was an error in processing your search.');
    }
}


export async function addBookEntryToDatabase(name: string, pageCount: number): Promise<string> {
    const id: string = uuidv4(); //generates random id
    const newBookEntry: BookEntryInDatabase = { id, name, pageCount };

    const filePath: string = path.join(databaseDir, `${id}.json`);

    try {
        //Writes the new book entry to it's own JSON file
        await fs.writeFile(filePath, JSON.stringify(newBookEntry, null, 2), 'utf-8');

        //Updates the databaseIndex with the new entry
        const indexContent: string = await fs.readFile(databaseIndexFilePath, 'utf-8');
        const indexContentJSON: IndexEntryDatabase[] = JSON.parse(indexContent);
        indexContentJSON.push({ id, name });
        await fs.writeFile(databaseIndexFilePath, JSON.stringify(indexContentJSON, null, 2), 'utf-8');

        return 'New book entry added to database.';
    }

    catch (error: any) {
        throw new Error('Failed to add the book entry to the database.');
    }
}