import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { orderId } = params;
    const { orderStatus } = await req.json();

    const order = await Order.findById(orderId);

    if (!order) {
      return Response.json(
        { message: "Order not valid" },
        { status: 400 }
      );
    }

    const newStatus = orderStatus || "DELIVERED";

    order.orderStatus = newStatus;
    order.isCompleted = newStatus === "DELIVERED";

    order.statusTimeline.push({
      status: newStatus,
      date: new Date(),
    });

    await order.save();

    return Response.json(order, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
