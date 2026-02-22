import Razorpay from "razorpay";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
	try {
		await connectDB();

		const body = await req.json();
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			orderId,
		} = body;

		const generated_signature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(razorpay_order_id + "|" + razorpay_payment_id)
			.digest("hex");

		if (generated_signature !== razorpay_signature) {
			return NextResponse.json(
				{ success: false, message: "Payment verification failed" },
				{ status: 400 },
			);
		}

		const payment = await razorpay.payments.fetch(razorpay_payment_id);

		if (payment.status !== "captured") {
			return NextResponse.json(
				{ success: false, message: "Payment not completed" },
				{ status: 400 },
			);
		}

		const order = await Order.findById(orderId);

		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 },
			);
		}

		order.paymentStatus = "PAID";
		order.isCompleted = false;

		await order.save();

		return NextResponse.json({
			success: true,
			message: "Payment verified successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 },
		);
	}
}
