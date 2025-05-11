import { validateIDInput, checkDashboardIDValid } from '@/app/_lib/validationFunctions';
import { removeEntry } from '@/app/_lib/dashboardFunctions';

export async function POST(request: Request) {
    const requestBody: { id: string } = await request.json();
    const id: unknown = requestBody.id;

    //Validates the id to ensure it's a non-empty string
    if (!validateIDInput(id)) {
        return new Response(JSON.stringify({ error: 'ID empty or in a wrong format.' }),
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
        //Attempts to remove the entry from the dashboard
        const dashboardAnswer: string = await removeEntry(id as string);
        
        //Successful response
        return new Response(JSON.stringify({ result: dashboardAnswer}),
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