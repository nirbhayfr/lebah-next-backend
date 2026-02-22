import { connectDB } from "@/lib/db";
import SuperCategory from "@/models/SuperCategory";

// ✅ CREATE SUPER CATEGORY (POST)
export async function POST(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name) {
      return Response.json(
        { message: "Name required" },
        { status: 400 }
      );
    }

    const exists = await SuperCategory.findOne({ name });
    if (exists) {
      return Response.json(
        { message: "Already exists" },
        { status: 400 }
      );
    }

    const superCategory = await SuperCategory.create({ name });

    return Response.json(superCategory, { status: 201 });

  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}


// ✅ GET SUPER CATEGORIES (GET)
export async function GET() {
  try {
    await connectDB();

    const data = await SuperCategory.find();

    return Response.json(data, { status: 200 });

  } catch (err) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
