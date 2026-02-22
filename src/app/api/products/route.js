import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

// ✅ CREATE PRODUCT
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { category, subCategory } = body;

    const categoryExist = await Category.findById(category);

    if (!categoryExist || !subCategory) {
      return Response.json(
        { message: "Invalid category" },
        { status: 400 }
      );
    }

    body.superCategory = categoryExist.superCategory;

    const product = await Product.create(body);

    return Response.json(product, { status: 201 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}


// ✅ GET ALL PRODUCTS (With Filters)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const superCategory = searchParams.get("superCategory");
    const subCategory = searchParams.get("subCategory");
    const search = searchParams.get("search");

    const filter = {};

    if (category) filter.category = category;
    if (superCategory) filter.superCategory = superCategory;
    if (subCategory) filter.subCategory = subCategory;

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).populate("category");

    return Response.json(products, { status: 200 });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
