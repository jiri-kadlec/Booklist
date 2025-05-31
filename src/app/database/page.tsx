import DatabaseClient from "@/app/database/databaseClient";

export const metadata = {
  title: "Database",
  description: "Database page",
};

export default function Database() {
  return <DatabaseClient />;
}
