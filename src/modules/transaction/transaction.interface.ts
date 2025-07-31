import { Document, Types } from "mongoose";

export interface ITransaction {
  appointment_id: Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  tran_id: string;
  currency: string;
}

export interface TransactionModel extends Document, ITransaction {
  createdAt: Date;
  updatedAt: Date;
}
