import { useState } from 'react'


const testSummary = [
    { id: 1, type: 'motion', time: '2:30 PM', description: 'Motion detected at front door', severity: 'low' },
    { id: 2, type: 'person', time: '2:45 PM', description: 'Person detected', severity: 'medium' },
    { id: 3, type: 'package', time: '3:15 PM', description: 'Package delivery detected', severity: 'medium' },
    { id: 4, type: 'motion', time: '4:20 PM', description: 'Motion detected near driveway', severity: 'low' },
];

function Summary({ timeRange }) {
    const events = testSummary;

    const getEventIcon = (type) => {
        switch (type) {
            case 'motion':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
            case 'person':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'package':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'low':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'high':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    
    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Event Summary</h2>
            <span className="text-sm text-gray-500">
                {timeRange || 'Last 24 hours'}
            </span>
            </div>
            <div className="mt-2 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-gray-600">{events.filter(e => e.severity === 'high').length} High</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="text-gray-600">{events.filter(e => e.severity === 'medium').length} Medium</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-gray-600">{events.filter(e => e.severity === 'low').length} Low</span>
            </div>
            </div>
        </div>

        <div className="p-4">
            <div className="space-y-3">
            {events.map((event) => (
                <div
                key={event.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(event.severity)}`}
                >
                <div className="flex-shrink-0 mt-0.5">
                    {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs mt-1 opacity-75">{event.time}</p>
                </div>
                <button className="flex-shrink-0 text-xs font-medium hover:underline">
                    View
                </button>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
}

export default Summary;
