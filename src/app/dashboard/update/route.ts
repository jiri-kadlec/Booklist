import { UpdateBookEntryToDashboardBody, Section } from '@/app/_lib/interfaces'
import { validateDashboardUpdateEntrySchema, checkDashboardIDValid, checkCurrentPageValid } from '@/app/_lib/validationFunctions';
import { getBookIDFromDashboardID, updateEntry } from '@/app/_lib/dashboardFunctions';

export async function POST(request: Request) {
    const requestBody: UpdateBookEntryToDashboardBody = await request.json();
    const id: unknown = requestBody.id;
    const section: unknown = requestBody.section;
    const currentPage: unknown = requestBody.currentPage;
    const rating: unknown = requestBody.rating;

    //If validation fails
    if (!validateDashboardUpdateEntrySchema(id, section, currentPage, rating)) {
        return new Response(JSON.stringify({ error: 'Invalid input.' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    //Checks if the id has a valid dashboard entry in data/dashboard
    if (!(await checkDashboardIDValid(id as string))) {
        return new Response(JSON.stringify({ error: 'Invalid ID.' }),
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    try {
        //Checks if the currentPage does not exceeds pageCount in book entry.
        const bookID: string = await getBookIDFromDashboardID(id as string);
        if (!(await checkCurrentPageValid(bookID, currentPage as number))) {
            return new Response(JSON.stringify({ error: 'Invalid currentPage.' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        }

        //Attempts to update the entry in dashboard
        const dashboardAnswer: string = await updateEntry(id as string, bookID as string, section as Section, currentPage as number, rating as number);

        //Successful response
        return new Response(JSON.stringify({ result: dashboardAnswer }),
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