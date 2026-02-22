import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { orderId } = params;
    const userId = req.headers.get("x-user-id"); // same as req.user.userId

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return Response.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.orderStatus !== "PLACED") {
      return Response.json(
        { message: "Order cannot be cancelled now" },
        { status: 400 }
      );
    }

    order.orderStatus = "CANCELLED";
    order.isCompleted = false;

    if (order.paymentMethod === "ONLINE") {
      order.paymentStatus = "FAILED";
    }

    order.statusTimeline.push({
      status: "CANCELLED",
      date: new Date(),
    });

    await order.save();

    return Response.json(
      {
        message: "Order cancelled successfully",
        data: order,
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
