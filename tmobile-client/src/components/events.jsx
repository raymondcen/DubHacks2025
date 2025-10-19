function Events({ events }) {
  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Activity Events
        </h2>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No events to display</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-gray-50"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 break-words">
                    {event.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {event.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with count */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        Showing {events.length} Events
      </div>
    </div>
  );
}

export default Events;
