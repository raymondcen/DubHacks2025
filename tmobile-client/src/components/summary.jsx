import { useState, useEffect } from "react";
import { initWebSocket, subscribe } from "../context/connection";

function Summary({ timeRange }) {
  const [events, setEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const toggleEventDetails = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  useEffect( () => {
    initWebSocket();

    const unsubscribe = subscribe("event", (payload) => {
      console.log(payload);
      setEvents( (prev) => [...prev, payload]);
    });
    return () => {
      unsubscribe();
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Event Summary
            </h2>
            <span className="text-sm text-gray-500">
              {timeRange || "Last 24 hours"}
            </span>
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-gray-600">
                {events.filter((e) => e.severity === "high").length} High
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="text-gray-600">
                {events.filter((e) => e.severity === "medium").length} Medium
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-gray-600">
                {events.filter((e) => e.severity === "low").length} Low
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {events.map((event) => {
              const isExpanded = expandedEventId === event.id;
              const isEmpty = events.length == 0;
              return { isEmpty } ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No events to display</p>
                </div>
              ) : (
                <div
                  key={event.id}
                  className={`rounded-lg border ${getSeverityColor(
                    event.severity
                  )} overflow-hidden transition-all`}
                >
                  {/* Event Header */}
                  <div className="flex items-start gap-3 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.message}</p>
                      <p className="text-xs mt-1 opacity-75">{event.timestamp}</p>
                    </div>
                    <button
                      onClick={() => toggleEventDetails(event.id)}
                      className="flex-shrink-0 text-xs font-medium hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? "Hide" : "View"}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-current border-opacity-20 bg-white bg-opacity-50 p-4">
                      <div className="space-y-3">
                        {/* Event Metadata */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold opacity-75 mb-1">
                              Event Type
                            </h4>
                            <p className="text-sm font-medium capitalize">
                              {event.type}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold opacity-75 mb-1">
                              Severity
                            </h4>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                                event.severity
                              )}`}
                            >
                              {event.severity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Summary;
