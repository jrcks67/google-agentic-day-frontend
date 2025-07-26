import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Clock,
  Award,
  Plus
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useGrades } from '../../hooks/useGrades';

const Dashboard = () => {
  const { data: gradesData, isLoading } = useGrades();
  const classes = gradesData?.data?.grades || [];

  // Mock stats - you can replace with real data later
  const stats = [
    {
      title: 'Total Classes',
      value: classes.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Total Students',
      value: classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0),
      icon: Users,
      color: 'bg-green-500',
      change: '+12 this month'
    },
    {
      title: 'Chat Sessions',
      value: 24,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: '+8 this week'
    },
    {
      title: 'Avg. Performance',
      value: '87%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5% this month'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Created new class',
      class: 'Class V',
      time: '2 hours ago',
      icon: Plus
    },
    {
      id: 2,
      action: 'Chat session completed',
      class: 'Class III',
      time: '4 hours ago',
      icon: MessageSquare
    },
    {
      id: 3,
      action: 'Student assessment',
      class: 'Class II',
      time: '1 day ago',
      icon: Award
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Teacher!</h1>
          <p className="text-blue-100">
            Here's what's happening with your classes today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Classes */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Classes</h3>
              <Link 
                to="/classes" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : classes.length > 0 ? (
              <div className="space-y-3">
                {classes.slice(0, 3).map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{cls.name}</h4>
                      <p className="text-sm text-gray-600">{cls.academic_year}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{cls.student_count || 0} students</p>
                      <p className="text-xs text-gray-500">
                        {new Date(cls.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No classes yet</p>
                <Link 
                  to="/classes" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Create your first class
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <activity.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.class} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/classes" 
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-blue-900">Manage Classes</span>
            </Link>
            <Link 
              to="/chat" 
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MessageSquare className="w-6 h-6 text-green-600" />
              <span className="font-medium text-green-900">Start Chat Session</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-purple-900">View Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
