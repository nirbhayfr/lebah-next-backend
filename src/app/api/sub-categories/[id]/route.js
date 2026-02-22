import { connectDB } from "@/lib/db";
import SubCategory from "@/models/SubCategory";
import Product from "@/models/Product";

// ✅ UPDATE SUB CATEGORY
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const {id} = await params;
    const updated = await SubCategory.findByIdAndUpdate(
      id,
      { name: (await req.json()).name },
      { new: true }
    );

    if (!updated) {
      return Response.json(
        { message: "SubCategory not found" },
        { status: 404 }
      );
    }

    return Response.json(updated, { status: 200 });

  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}


// ✅ DELETE SUB CATEGORY + RELATED PRODUCTS
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // 1️⃣ Delete products under this subcategory
    await Product.deleteMany({ subCategory: id });

    // 2️⃣ Delete subcategory
    const deleted = await SubCategory.findByIdAndDelete({_id:id});

    if (!deleted) {
      return Response.json(
        { message: "SubCategory not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "SubCategory and related products deleted" },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
