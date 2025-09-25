import * as notificationService from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationRead(req.params.id);
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
