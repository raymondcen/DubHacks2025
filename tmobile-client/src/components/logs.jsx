import { useState, useEffect } from 'react';

// const event = {
//     id: Number,
//     severity: String,
//     description: String,
//     timestamp: Number
// };
const testEvents = [
    { id: 1, timestamp: '2025-10-18 14:30:22', message: 'Camera connection established', category: 'system' },
    { id: 2, timestamp: '2025-10-18 14:30:45', message: 'Motion detection enabled', category: 'detection' },
    { id: 3, timestamp: '2025-10-18 14:32:10', message: 'Low light conditions detected', category: 'camera' },
    { id: 4, timestamp: '2025-10-18 14:45:33', message: 'Person detected at entrance', category: 'detection' },
    { id: 5, timestamp: '2025-10-18 15:15:22', message: 'Package delivery recorded', category: 'detection' },
    { id: 6, timestamp: '2025-10-18 15:20:44', message: 'Network connectivity issue', category: 'system' },
    { id: 7, timestamp: '2025-10-18 15:21:05', message: 'Connection restored', category: 'system' },
    { id: 8, timestamp: '2025-10-18 16:20:15', message: 'Motion detected in driveway', category: 'detection' },
    { id: 9, timestamp: '2025-10-18 16:45:30', message: 'Night mode activated', category: 'camera' },
    { id: 10, timestamp: '2025-10-18 17:00:12', message: 'Recording saved to cloud', category: 'storage' },
];

function Logs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Simulate api fetching events
        setLogs(testEvents);
    }, []);

    return (
        <div className="h-full bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Activity Logs</h2>
      </div>

      {/* Logs list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No logs to display</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-gray-50"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 break-words">
                    {log.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with count */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        Showing {logs.length} logs
      </div>
    </div>
  );
}

export default Logs;