import { useEffect } from "react";

const colors = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
};

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed top-4 right-4 z-50 ${colors[type]} text-white px-4 py-3 rounded shadow-lg text-sm`}>
      {message}
    </div>
  );
}