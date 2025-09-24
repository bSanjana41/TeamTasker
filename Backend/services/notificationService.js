import Notification from "../models/notificationSchema.js";

export const getUserNotifications = async (userId) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
};

export const markNotificationRead = async (notificationId) => {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};
