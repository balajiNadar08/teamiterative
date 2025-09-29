"use client";

import { useState } from "react";
import Link from "next/link";

// Dummy Analytics Data
const analyticsData = {
  overview: {
    totalAPIRequests: 45678,
    totalPatients: 1234,
    totalDiseases: 14,
    activeUsers: 89,
    avgResponseTime: "234ms",
    successRate: 98.5,
  },
  
  apiUsage: [
    { month: "Jan", requests: 3200, patients: 120, errors: 45 },
    { month: "Feb", requests: 4100, patients: 145, errors: 38 },
    { month: "Mar", requests: 3800, patients: 135, errors: 42 },
    { month: "Apr", requests: 5200, patients: 178, errors: 51 },
    { month: "May", requests: 6300, patients: 210, errors: 48 },
    { month: "Jun", requests: 7100, patients: 245, errors: 55 },
  ],
  
  topDiseases: [
    { name: "vAtavyAdhiH", code: "AA", count: 234, percentage: 18.9 },
    { name: "doShavaiShamyam", code: "A", count: 198, percentage: 16.0 },
    { name: "vAtaprakopaH", code: "SR10", count: 176, percentage: 14.2 },
    { name: "vAtasa~jcayaH", code: "SR11", count: 154, percentage: 12.5 },
    { name: "vAtavRuddhiH", code: "SR12", count: 142, percentage: 11.5 },
  ],
  
  apiEndpoints: [
    { endpoint: "/api/translate", calls: 12543, avgTime: "145ms", status: "healthy" },
    { endpoint: "/api/fhir/bundle", calls: 8976, avgTime: "312ms", status: "healthy" },
    { endpoint: "/api/patient/create", calls: 5432, avgTime: "287ms", status: "healthy" },
    { endpoint: "/api/disease/search", calls: 4321, avgTime: "98ms", status: "healthy" },
    { endpoint: "/api/export", calls: 2109, avgTime: "523ms", status: "warning" },
  ],
  
  languageUsage: [
    { language: "English", code: "en", percentage: 45, users: 556 },
    { language: "Hindi", code: "hi", percentage: 28, users: 346 },
    { language: "Marathi", code: "mr", percentage: 15, users: 185 },
    { language: "Others", code: "others", percentage: 12, users: 148 },
  ],
  
  recentActivity: [
    { id: 1, action: "Patient Created", user: "Dr. Sharma", time: "2 min ago", status: "success" },
    { id: 2, action: "FHIR Bundle Generated", user: "Dr. Patel", time: "5 min ago", status: "success" },
    { id: 3, action: "Disease Search", user: "Dr. Kumar", time: "8 min ago", status: "success" },
    { id: 4, action: "Data Export", user: "Admin", time: "12 min ago", status: "warning" },
    { id: 5, action: "Translation Request", user: "Dr. Singh", time: "15 min ago", status: "success" },
    { id: 6, action: "API Authentication", user: "System", time: "18 min ago", status: "error" },
  ],
  
  systemHealth: {
    cpu: 45,
    memory: 62,
    storage: 38,
    network: 78,
  },
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="navbar px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium text-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/">Demo</Link>
              </li>
              <li>
                <Link href="/translate">Translate</Link>
              </li>
              <li>
                <Link href="/documentation">Documentation</Link>
              </li>
              <li>
                <Link href="/analytics">Analytics</Link>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">
            NavaSetu
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Demo</Link>
            </li>
            <li>
              <Link href="/translate">Translate</Link>
            </li>
            <li>
              <Link href="/documentation">Documentation</Link>
            </li>
            <li>
              <Link href="/analytics">Analytics</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Login</a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              API Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor your AYUSH Healthcare System performance
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total API Requests</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {analyticsData.overview.totalAPIRequests.toLocaleString()}
                </h3>
                <p className="text-green-600 text-xs mt-2">↑ 12.5% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Patients</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {analyticsData.overview.totalPatients.toLocaleString()}
                </h3>
                <p className="text-green-600 text-xs mt-2">↑ 8.2% from last month</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Response Time</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {analyticsData.overview.avgResponseTime}
                </h3>
                <p className="text-green-600 text-xs mt-2">↓ 15ms from last month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Success Rate</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {analyticsData.overview.successRate}%
                </h3>
                <p className="text-green-600 text-xs mt-2">↑ 0.3% from last month</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* API Usage Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">API Usage Trend</h3>
            <div className="space-y-4">
              {analyticsData.apiUsage.map((data, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{data.month}</span>
                    <span className="text-gray-800 font-semibold">{data.requests.toLocaleString()} requests</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(data.requests / 7500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Diseases */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Most Diagnosed Diseases</h3>
            <div className="space-y-4">
              {analyticsData.topDiseases.map((disease, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium text-sm">{disease.name}</p>
                      <p className="text-gray-500 text-xs">Code: {disease.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-bold">{disease.count}</p>
                    <p className="text-gray-500 text-xs">{disease.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Endpoints Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">API Endpoints Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Endpoint</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Total Calls</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Avg Response Time</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.apiEndpoints.map((endpoint, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800 font-mono text-sm">{endpoint.endpoint}</td>
                    <td className="py-3 px-4 text-gray-700">{endpoint.calls.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700">{endpoint.avgTime}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        endpoint.status === 'healthy' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {endpoint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Language Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Language Usage</h3>
            <div className="space-y-4">
              {analyticsData.languageUsage.map((lang, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{lang.language}</span>
                    <span className="text-gray-600">{lang.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${lang.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{lang.users} users</p>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">System Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">CPU Usage</span>
                  <span className="text-gray-800 font-semibold">{analyticsData.systemHealth.cpu}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.systemHealth.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Memory Usage</span>
                  <span className="text-gray-800 font-semibold">{analyticsData.systemHealth.memory}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.systemHealth.memory}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Storage Usage</span>
                  <span className="text-gray-800 font-semibold">{analyticsData.systemHealth.storage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.systemHealth.storage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Network Load</span>
                  <span className="text-gray-800 font-semibold">{analyticsData.systemHealth.network}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.systemHealth.network}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}