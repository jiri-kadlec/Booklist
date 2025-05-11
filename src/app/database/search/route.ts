import { searchDatabase } from '@/app/_lib/databaseFunctions';
import { validateSearchedTermInput } from '@/app/_lib/validationFunctions';

export async function POST(request: Request) {
    //Parses the incoming request body
    const requestBody: { searchedTerm: string } = await request.json();
    const searchedTerm: unknown = requestBody.searchedTerm;

    //Validates the searched term to ensure it's a non-empty string
    if (!validateSearchedTermInput(searchedTerm)) {
        return new Response(JSON.stringify({ error: 'Searched term is empty or in a wrong format.' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    try {
        //Performs database search using the validated search term
        const searchResults = await searchDatabase(searchedTerm as string);

        //If searchResults is empty
        if (searchResults.length === 0) {
            return new Response(JSON.stringify({ message: 'No books under that name found.' }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        }

        //Successful non-empty response
        return new Response(JSON.stringify({ results: searchResults }),
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