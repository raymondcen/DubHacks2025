import { useState } from 'react';

function Timeline({ onTimeRangeChange }) {
    const [selectedRange, setSelectedRange] = useState('24h');
    
    const intervals = [
        { value: '15m', label: 'Last 15 minutes'},
        { value: '30m', label: 'Last 30 minutes'},
        { value: '1h', label: 'Last Hour'},
        { value: '12h', label: 'Last 12 Hours'},
        { value: '24h', label: 'Last 24 Hours'},
    ];

    const handleRangeChange = (range) => {
        setSelectedRange(range);
        if(onTimeRangeChange){
            onTimeRangeChange(range);
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
        </div>
      </div>
      {/* Quick range buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {intervals.map((range) => (
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
    </div>
  );
}

export default Timeline;