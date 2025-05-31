interface ConfirmModalProps {
  title: string;
  message: string;
  color: "blue" | "red";
  onResult: (result: boolean) => void;
}

export default function ConfirmModal({
  title,
  message,
  color,
  onResult,
}: ConfirmModalProps) {
  const confirmButtonColor =
    color === "red"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-contrast-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="mb-4 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onResult(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onResult(true)}
            className={`px-4 py-2 text-white rounded ${confirmButtonColor}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
