import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

// ✅ UPDATE CATEGORY (PUT)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const { name, image, superCategory } = await req.json();
    const category = await Category.findByIdAndUpdate(
      id,
      { name, image, superCategory },
      { new: true }
    );

    if (!category) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json(category, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// ✅ DELETE CATEGORY (DELETE)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return Response.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
