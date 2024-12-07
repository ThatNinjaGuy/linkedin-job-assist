import React from "react";

function Notification({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50">
      {message}
    </div>
  );
}

export default Notification;
