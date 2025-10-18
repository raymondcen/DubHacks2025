import { useState } from 'react';

function LogsPanel() {
  const [filter, setFilter] = useState('all');
  const [logs] = useState([
    { id: 1, timestamp: '2025-10-18 14:30:22', level: 'info', message: 'Camera connection established', category: 'system' },
    { id: 2, timestamp: '2025-10-18 14:30:45', level: 'info', message: 'Motion detection enabled', category: 'detection' },
    { id: 3, timestamp: '2025-10-18 14:32:10', level: 'warning', message: 'Low light conditions detected', category: 'camera' },
    { id: 4, timestamp: '2025-10-18 14:45:33', level: 'info', message: 'Person detected at entrance', category: 'detection' },
    { id: 5, timestamp: '2025-10-18 15:15:22', level: 'success', message: 'Package delivery recorded', category: 'detection' },
    { id: 6, timestamp: '2025-10-18 15:20:44', level: 'error', message: 'Network connectivity issue', category: 'system' },
    { id: 7, timestamp: '2025-10-18 15:21:05', level: 'success', message: 'Connection restored', category: 'system' },
    { id: 8, timestamp: '2025-10-18 16:20:15', level: 'info', message: 'Motion detected in driveway', category: 'detection' },
    { id: 9, timestamp: '2025-10-18 16:45:30', level: 'info', message: 'Night mode activated', category: 'camera' },
    { id: 10, timestamp: '2025-10-18 17:00:12', level: 'info', message: 'Recording saved to cloud', category: 'storage' },
  ]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'info':
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        );
      case 'success':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        );
    }
  };

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.level === filter);

  return (
    <div className="h-full bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Activity Logs</h2>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'info', 'success', 'warning', 'error'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === level
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Logs list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No logs to display</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors ${getLevelColor(log.level)}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  {getLevelIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase">
                      {log.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.category}
                    </span>
                  </div>
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
        Showing {filteredLogs.length} of {logs.length} logs
      </div>
    </div>
  );
}

export default LogsPanel;
