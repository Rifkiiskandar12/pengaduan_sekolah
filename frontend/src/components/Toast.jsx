import { useEffect } from "react";

const toneClass = {
  success: "toast-success",
  error: "toast-error",
  warning: "toast-warning",
};

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${toneClass[type] || toneClass.success}`} role="status">
      {message}
    </div>
  );
}
