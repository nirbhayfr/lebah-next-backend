import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { orderId } = params;

    const orderDetails = await Order.findById(orderId);

    if (!orderDetails) {
      return Response.json(
        { message: "Order not valid" },
        { status: 400 }
      );
    }

    return Response.json(orderDetails, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}





