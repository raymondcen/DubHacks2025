import { useState } from 'react';

function TimelineControls({ onTimeRangeChange }) {
  const [selectedRange, setSelectedRange] = useState('24h');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const quickRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' },
  ];

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    if (range !== 'custom') {
      setShowCustomRange(false);
      if (onTimeRangeChange) {
        onTimeRangeChange(range);
      }
    } else {
      setShowCustomRange(true);
    }
  };

  const handleCustomRangeApply = () => {
    if (startDate && endDate && onTimeRangeChange) {
      onTimeRangeChange({ start: startDate, end: endDate });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Select time range</span>
        </div>
      </div>

      {/* Quick range buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              selectedRange === range.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom date range picker */}
      {showCustomRange && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleCustomRangeApply}
            disabled={!startDate || !endDate}
            className="mt-4 w-full md:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply Custom Range
          </button>
        </div>
      )}

      {/* Timeline visualization */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Start</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
}

export default TimelineControls;
