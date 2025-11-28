"use strict";

const createError = require("http-errors");
const db = require("../../models");
const { Op } = require("sequelize");

// Helper: get user registration date or default
async function getUserRegDate(userId) {
  if (!userId) return new Date(0);
  const user = await db.User.findByPk(userId);
  return user ? user.createdAt : new Date(0);
}

module.exports = {
  // ----------------------------------------------------
  // GET NOTIFICATIONS FOR LOGGED-IN USER
  // ----------------------------------------------------
  index: async (req, res, next) => {
    try {
      const userId = req.user?.id; // from JWT token
      if (!userId) return next(createError(401, "Unauthorized"));

      const regDate = await getUserRegDate(userId);

      // Fetch personal + global notifications
      const personalNotifications = await db.Notification.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      const globalNotifications = await db.Notification.findAll({
        where: {
          target: "global",
          createdAt: { [Op.gte]: regDate },
        },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: {
          personal: personalNotifications,
          global: globalNotifications,
          unreadCount:
            personalNotifications.filter((n) => !n.isRead).length +
            globalNotifications.filter((n) => !n.isRead).length,
        },
      });
    } catch (error) {
      console.error(error);
      next(createError(500, "Failed to retrieve notifications"));
    }
  },

  // ---------------------------------
  // CREATE NEW NOTIFICATION
  // ---------------------------------
  store: async (req, res, next) => {
    try {
      const { message, target, userId, title, type, actionUrl, meta } =
        req.body;

      // personal notifications must have userId
      if (target === "personal" && !userId) {
        return next(
          createError(400, "userId is required for personal notifications")
        );
      }

      const notification = await db.Notification.create({
        userId: target === "personal" ? userId : null,
        target,
        title,
        message,
        type: type || "info",
        actionUrl: actionUrl || null,
        meta: meta || null,
      });

      res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: notification,
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to create notification"));
    }
  },

  // ---------------------------------
  // MARK SINGLE NOTIFICATION AS READ
  // ---------------------------------
  markAsRead: async (req, res, next) => {
    try {
      const { id } = req.params;
      const notification = await db.Notification.findByPk(id);
      if (!notification)
        return next(createError(404, "Notification not found"));

      notification.isRead = true;
      await notification.save();

      res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to mark notification as read"));
    }
  },

  // ---------------------------------
  // MARK ALL NOTIFICATIONS AS SEEN
  // ---------------------------------
  markAllAsSeen: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const guestFirstOpen = req.body.guestFirstOpen;

      if (!userId && !guestFirstOpen)
        return next(
          createError(400, "Either userId or guestFirstOpen is required")
        );

      let whereCondition;

      if (userId) {
        const regDate = await getUserRegDate(userId);

        whereCondition = {
          [Op.or]: [
            { userId, isSeen: false },
            {
              target: "global",
              isSeen: false,
              createdAt: { [Op.gte]: regDate },
            },
          ],
        };
      } else {
        whereCondition = {
          target: "global",
          isSeen: false,
          createdAt: { [Op.gte]: new Date(guestFirstOpen) },
        };
      }

      await db.Notification.update({ isSeen: true }, { where: whereCondition });

      res.status(200).json({
        success: true,
        message: "All notifications marked as seen",
      });
    } catch (err) {
      console.error(err);
      next(createError(500, "Failed to mark notifications as seen"));
    }
  },
};
