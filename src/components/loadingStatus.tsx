export default function LoadingStatus() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      <p className="text-gray-600 text-lg">Loading...</p>
    </div>
  );
}
