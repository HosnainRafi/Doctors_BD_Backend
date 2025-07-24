import { Notification } from "./notification.model";
import { INotification, NotificationModel } from "./notification.interface";
import { FilterQuery } from "mongoose";

export const NotificationService = {
  async createNotification(payload: INotification): Promise<NotificationModel> {
    return await Notification.create(payload);
  },

  async getNotifications(
    filters: FilterQuery<INotification> = {}
  ): Promise<NotificationModel[]> {
    return await Notification.find(filters).sort({ createdAt: -1 });
  },

  async markAsRead(id: string): Promise<NotificationModel | null> {
    return Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  },

  async markAllAsRead(user_id: string): Promise<{ modifiedCount: number }> {
    const result = await Notification.updateMany(
      { user_id, isRead: false },
      { isRead: true }
    );
    return { modifiedCount: result.modifiedCount };
  },
};
