import { viewDashboard } from '@/app/_lib/dashboardFunctions';
import { Section } from '@/app/_lib/interfaces'
import { validateSectionInput } from '@/app/_lib/validationFunctions';

export async function POST(request: Request) {
    const requestBody: { section: Section } = await request.json();
    const section: unknown = requestBody.section;

    //Validates the section to ensure it's a non-empty Section type
    if (!validateSectionInput(section)) {
        return new Response(JSON.stringify({ error: 'Section is empty or in a wrong format.' }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    }

    try {
        const viewDashboardResults = await viewDashboard(section as Section);

        //If viewDashboardResults is empty
        if (viewDashboardResults.validfoundDashboardEntries.length === 0) {
            return new Response(JSON.stringify({ message: 'No entries in this category.' }),
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
        }

        //Successful non-empty response
        return new Response(JSON.stringify(viewDashboardResults),
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