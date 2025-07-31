// src/modules/transaction/transaction.model.ts
import { Schema, model, Types, Document } from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    appointment_id: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    tran_id: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      default: "BDT",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create and export the model
export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
