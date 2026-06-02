export type DeliveryStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "failed"
  | "retrying";

export interface ReminderDelivery {
  id: string;
  reminderId: string;
  userId: string;
  deliveryType: string;
  status: DeliveryStatus;
  deliveredAt?: string;
  errorMessage?: string;
  createdAt: string;
}
