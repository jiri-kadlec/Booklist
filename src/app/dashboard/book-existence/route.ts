import { checkBookEntryInDashboardDoesNotExist } from "@/app/_lib/validationFunctions";

export async function POST(request: Request) {
  const bookIDs: string[] = await request.json();
  const addableBooks: string[] = [];

  for (const id of bookIDs) {
    if (await checkBookEntryInDashboardDoesNotExist(id)) {
      addableBooks.push(id); //contains ids of books that can be added to dashboard
    }
  }

  return new Response(JSON.stringify({ addableBooks }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
