import { addBookEntryToDatabase } from '@/app/_lib/databaseFunctions';
import { AddBookEntryToDatabaseBody } from '@/app/_lib/interfaces'
import { validateBookEntryInput } from '@/app/_lib/validationFunctions';

export async function POST(request: Request) {
    //Parses the incoming request body
    const requestBody: AddBookEntryToDatabaseBody = await request.json();
    const name: unknown = requestBody.name;
    const pageCount: unknown = requestBody.pageCount;

    //If validation fails
    if (!validateBookEntryInput(name, pageCount)) {
        return new Response(JSON.stringify({ error: 'Invalid input.' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    try {
        //Attempts to add the new book entry to database
        const databaseAnswer: string = await addBookEntryToDatabase(name as string, pageCount as number);

        //Successful response
        return new Response(JSON.stringify({ result: databaseAnswer }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    catch (error: any) {
        return new Response(JSON.stringify({ error: (error as Error).message }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

}