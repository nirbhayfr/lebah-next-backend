import { connectDB } from "@/lib/db";
import SubCategory from "@/models/SubCategory";

// ✅ CREATE SUB CATEGORY
export async function POST(req) {
  try {
    await connectDB();
    const { name, category } = await req.json();

    const existing = await SubCategory.findOne({
      name: name.trim().toLowerCase(),
      category,
    });

    if (existing) {
      return Response.json(
        { message: "SubCategory already exists in this category" },
        { status: 400 }
      );
    }

    const sub = await SubCategory.create({
      name: name.trim().toLowerCase(),
      category,
    });

    return Response.json(sub, { status: 201 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// ✅ GET SUB CATEGORIES (Optional filter by category)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const filter = category ? { category } : {};

    const data = await SubCategory.find(filter);

    return Response.json(data, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
