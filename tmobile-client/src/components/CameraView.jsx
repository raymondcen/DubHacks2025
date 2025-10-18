import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import EventSummary from './EventSummary';
import LogsPanel from './LogsPanel';
import TimelineControls from './TimelineControls';

function CameraView() {
  const [timeRange, setTimeRange] = useState('Last 24 hours');

  const handleTimeRangeChange = (range) => {
    if (typeof range === 'string') {
      const rangeLabels = {
        '1h': 'Last hour',
        '6h': 'Last 6 hours',
        '24h': 'Last 24 hours',
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
      };
      setTimeRange(rangeLabels[range] || range);
    } else {
      setTimeRange(`${range.start} to ${range.end}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ring Camera Monitor</h1>
                <p className="text-sm text-gray-500">Front Door Camera</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Settings
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                Download Recording
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - YouTube-like layout */}
      <div className="max-w-full px-6 py-6">
        <div className="flex gap-6">
          {/* Left side - Video player and event summary (70% width) */}
          <div className="flex-1" style={{ maxWidth: '70%' }}>
            {/* Timeline controls */}
            <div className="mb-6">
              <TimelineControls onTimeRangeChange={handleTimeRangeChange} />
            </div>

            {/* Video player */}
            <div className="mb-4">
              <VideoPlayer />
            </div>

            {/* Video info section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Live Camera Feed - Front Door
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>1080p HD</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Connected</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Monitoring activity at your front door. Motion detection and person recognition enabled.
                Recording to cloud storage with 30-day retention.
              </p>
            </div>

            {/* Event summary below the video */}
            <EventSummary timeRange={timeRange} />
          </div>

          {/* Right side - Logs panel (30% width) */}
          <div className="w-full" style={{ maxWidth: '30%' }}>
            <div className="sticky top-24">
              <LogsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraView;
