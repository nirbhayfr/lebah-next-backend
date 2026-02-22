import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { customerId, products, shippingAddress } = await req.json();

    const customerExists = await User.findById(customerId);
    if (!customerExists) {
      return Response.json({ message: "Invalid customer ID" }, { status: 400 });
    }

    if (!products || products.length === 0) {
      return Response.json(
        { message: "Order must contain at least one product" },
        { status: 400 }
      );
    }

    let orderItems = [];
    let totalAmount = 0;

    for (const item of products) {
      const dbProduct = await Product.findById(item.product);

      if (!dbProduct) {
        return Response.json(
          { message: `Invalid product ID: ${item.product}` },
          { status: 400 }
        );
      }

      if (!dbProduct.inStock) {
        return Response.json(
          { message: `${dbProduct.title} is currently unavailable` },
          { status: 400 }
        );
      }

      const subtotal = dbProduct.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: dbProduct._id,
        title: dbProduct.title,
        images: dbProduct.images,
        category: dbProduct.category,
        price: dbProduct.price,
        quantity: item.quantity,
        subtotal,
      });
    }

    const newOrder = new Order({
      user: customerId,
      products: orderItems,
      shippingAddress,
      totalAmount,
      statusTimeline: [{ status: "PLACED", date: new Date() }],
    });

    await newOrder.save();

    const savedOrder = await Order.findById(newOrder._id);

    return Response.json(savedOrder, { status: 201 });

  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const allOrders = await Order.find({});
    return Response.json(allOrders, { status: 200 });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
