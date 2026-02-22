import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { userId } = params;

    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return Response.json(
        { message: "User is not valid" },
        { status: 400 }
      );
    }

    const allOrders = await Order.find({ user: userId }).sort({
      createdAt: -1,
    });

    return Response.json(allOrders, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
