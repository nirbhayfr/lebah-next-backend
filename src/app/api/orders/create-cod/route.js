import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await connectDB();
    const { products, shippingAddress } = await req.json();
    const customerId = req.headers.get("x-user-id");

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
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      isCompleted: false,
      statusTimeline: [{ status: "PLACED", date: new Date() }],
    });

    await newOrder.save();

    return Response.json(
      { orderId: newOrder._id },
      { status: 201 }
    );

  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
