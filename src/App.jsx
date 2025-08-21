import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [eventType, setEventType] = useState("like");
  const [sourceUserId, setSourceUserId] = useState("user1");
  const [targetUserId, setTargetUserId] = useState("user2");

  console.log(import.meta.env.VITE_BACKEND_URL);

  // Poll notifications every 5 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/notifications/${targetUserId}`
        );

        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [targetUserId]);

  // Handle event submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events`, {
        type: eventType,
        sourceUserId,
        targetUserId,
        data: { sourceUsername: sourceUserId === "user1" ? "Alice" : "Bob" },
      });

      toast.success("Event triggered!", {
        style: {
          border: "1px solid #29bf12",
          padding: "16px",
          color: "#29bf12",
        },
      });
    } catch (error) {
      console.error("Error triggering event:", error);

      toast.error("Failed to trigger event", {
        style: {
          border: "1px solid red",
          padding: "16px",
          color: "red",
        },
      });
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-8 drop-shadow-sm">
            🚀 Insyd Notification POC
          </h1>

          {/* Trigger Event Form */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Trigger Event
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex flex-col items-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer mt-3"
                  >
                    <option value="like">Like</option>
                    <option value="comment">Comment</option>
                    <option value="follow">Follow</option>
                  </select>
                </div>

                {/* Source User */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Source User
                  </label>
                  <select
                    value={sourceUserId}
                    onChange={(e) => setSourceUserId(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer mt-3"
                  >
                    <option value="user1">Alice</option>
                    <option value="user2">Bob</option>
                  </select>
                </div>

                {/* Target User */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Target User
                  </label>
                  <select
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className="w-full border rounded-lg p-2 text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer mt-3"
                  >
                    <option value="user1">Alice</option>
                    <option value="user2">Bob</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
              >
                Trigger Event
              </button>
            </form>
          </div>

          {/* Notifications List */}
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Notifications for{" "}
              <span className="text-blue-600">{targetUserId}</span>
            </h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500 italic">No notifications yet 🚫</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((notif) => (
                  <li
                    key={notif.notificationId}
                    className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:shadow-sm transition"
                  >
                    <p className="text-sm text-gray-600">
                      <strong className="text-blue-500">Type:</strong>{" "}
                      {notif.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong className="text-blue-500">Content:</strong>{" "}
                      {notif.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ⏰ {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
