import { useState, useEffect } from "react";

function Livestream({ currentFrame, frameBuffer, maxBufferSize }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      // Update the time every second
      const interval = setInterval(() => {
        setTime(new Date());
      }, 950);

      // Cleanup on unmount
      return () => clearInterval(interval);
    }, []);

  return (
    <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
      {/* Camera feed or placeholder */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        {currentFrame && isPlaying ? (
          <img
            src={currentFrame}
            alt="Live camera feed"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Camera Feed</p>
            <p className="text-gray-500 text-xs mt-1">
              {isConnected ? 'Paused' : 'Waiting for connection...'}
            </p>
          </div>
        )}
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        LIVE
      </div>

      {/* Camera controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="text-white text-xs">
            Buffer: {frameBuffer?.length || 0}/{maxBufferSize} frames
          </div>
          <div className="text-white text-sm font-medium">
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Livestream;
