import React, { useState } from 'react';
import { Bell, CheckCircle, XCircle, Circle, CheckCheck } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

interface Notification {
    id: number;
    type: string;
    title: string;
    text: string;
    href: string;
    read: boolean;
    created_at: string;
}

interface Props {
    notifications: Notification[];
    unreadCount: number;
}

const Notifications = ({ notifications, unreadCount }: Props) => {
    const [isMarkingAll, setIsMarkingAll] = useState(false);

    const getIcon = (type: string) => {
        if (type === 'class_offering_accepted') {
            return <CheckCircle size={20} className="text-emerald-600" />;
        } else if (type === 'class_offering_rejected') {
            return <XCircle size={20} className="text-red-600" />;
        }
        return <Bell size={20} className="text-blue-600" />;
    };

    const getIconBg = (type: string) => {
        if (type === 'class_offering_accepted') {
            return 'bg-emerald-100 text-emerald-600';
        } else if (type === 'class_offering_rejected') {
            return 'bg-red-100 text-red-600';
        }
        return 'bg-blue-100 text-blue-600';
    };

    const getBorderColor = (type: string) => {
        if (type === 'class_offering_accepted') return 'border-l-emerald-500';
        if (type === 'class_offering_rejected') return 'border-l-red-500';
        return 'border-l-blue-500';
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleMarkAsRead = (id: number) => {
        router.post(`/notifications/${id}/read`, {}, {
            preserveScroll: true,
        });
    };

    const handleMarkAllAsRead = () => {
        if (unreadCount === 0) return;
        setIsMarkingAll(true);
        router.post('/notifications/mark-all-read', {}, {
            preserveScroll: true,
            onFinish: () => setIsMarkingAll(false),
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read if not already
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }
        // Navigate to the href
        if (notification.href) {
            router.get(notification.href);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex-1 p-6 md:p-8 bg-[#F3F4F9] min-h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <Bell className="text-emerald-600" size={28} />
                            <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={isMarkingAll}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition disabled:opacity-50"
                            >
                                <CheckCheck size={18} />
                                {isMarkingAll ? 'Marking...' : 'Mark all as read'}
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No notifications yet</p>
                            <p className="text-gray-300 text-sm mt-1">You'll see notifications here when you receive them</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`bg-white p-5 md:p-6 rounded-2xl shadow-sm border-l-4 flex gap-4 transition hover:shadow-md cursor-pointer ${
                                        getBorderColor(notification.type)
                                    } ${!notification.read ? 'bg-emerald-50/30' : ''}`}
                                >
                                    {/* Icon */}
                                    <div className={`p-2 rounded-full h-fit flex-shrink-0 ${getIconBg(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                                                {notification.title}
                                                {!notification.read && (
                                                    <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full ml-2 align-middle"></span>
                                                )}
                                            </h3>
                                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                {formatDate(notification.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {notification.text}
                                        </p>
                                        {!notification.read && (
                                            <div className="mt-3 flex justify-end">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notification.id);
                                                    }}
                                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                                >
                                                    Mark as read
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer Info */}
                    {notifications.length > 0 && (
                        <div className="mt-6 text-center text-xs text-gray-400">
                            {unreadCount > 0
                                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                : 'All notifications read'
                            }
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Notifications;
