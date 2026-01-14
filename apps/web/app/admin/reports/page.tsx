"use client";

// Reusing charts from dashboard for detailed view
// In a real app, this would have filters per chart.
export default function ReportsPage() {
    return (
        <div>
            <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">Detailed Reports</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm h-[500px] mb-8">
                <h2 className="text-xl font-bold mb-4">Financial Overview</h2>
                <p className="text-gray-500">More detailed financial breakdowns would go here.</p>
            </div>
        </div>
    );
}
