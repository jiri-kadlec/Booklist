import { writeBookEntryToDashboard } from '@/app/_lib/dashboardFunctions';
import { AddBookEntryToDashboardBody, Section } from '@/app/_lib/interfaces'
import { validateDashboardEntryInput, checkBookIDValid, checkBookEntryInDashboardDoesNotExist, checkCurrentPageValid } from '@/app/_lib/validationFunctions';

export async function POST(request: Request) {
    const requestBody: AddBookEntryToDashboardBody = await request.json();
    const bookID: unknown = requestBody.bookID;
    const section: unknown = requestBody.section;
    const currentPage: unknown = requestBody.currentPage;
    const rating: unknown = requestBody.rating;

    //If validation fails
    if (!validateDashboardEntryInput(bookID, section, currentPage, rating)) {

        return new Response(JSON.stringify({ error: 'Invalid input.' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    //Checks if the bookID is valid
    if (!(await checkBookIDValid(bookID as string,))) {
        return new Response(JSON.stringify({ error: 'Invalid bookID.' }),
            {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    try {
        //Checks if the bookID does not already exist in the dashboard
        if (!(await checkBookEntryInDashboardDoesNotExist(bookID as string,))) {
            return new Response(JSON.stringify({ error: 'Book entry already exists in the dashboard.' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        }

        //Checks if the currentPage does not exceeds pageCount in book entry.
        if (!(await checkCurrentPageValid(bookID as string, currentPage as number))) {
            return new Response(JSON.stringify({ error: 'Invalid currentPage.' }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        }

        //Attempts to add the new book entry to dashboard
        const dashboardAnswer: string = await writeBookEntryToDashboard(bookID as string, section as Section, currentPage as number, rating as number);

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