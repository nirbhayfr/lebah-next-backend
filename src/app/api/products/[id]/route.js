import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

// ✅ GET SINGLE PRODUCT
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(product, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// ✅ UPDATE PRODUCT
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = await params;
    if (body.category) {
      const categoryExist = await Category.findById(body.category);
      if (!categoryExist) {
        return Response.json(
          { message: "Invalid category" },
          { status: 400 }
        );
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(updated, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// ✅ DELETE PRODUCT
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Product deleted" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
