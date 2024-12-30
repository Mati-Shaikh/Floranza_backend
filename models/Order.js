const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    perfumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Perfume", required: true },
    paymentStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);