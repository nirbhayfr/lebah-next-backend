import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import SuperCategory from "@/models/SuperCategory";

// ✅ CREATE CATEGORY (POST)
export async function POST(req) {
	try {
		await connectDB();
		const { name, image, superCategory } = await req.json();

		if (!name || !image || !superCategory) {
			return Response.json(
				{ message: "All Fields are required!!" },
				{ status: 400 },
			);
		}

		const existing = await Category.findOne({ name });
		if (existing) {
			return Response.json(
				{ message: "Category already exists" },
				{ status: 400 },
			);
		}

		const category = await Category.create({
			name,
			image,
			superCategory,
		});

		return Response.json(category, { status: 201 });
	} catch (error) {
		console.log(error.message);
		return Response.json({ message: error.message }, { status: 500 });
	}
}

// ✅ GET ALL CATEGORIES (GET)
export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const superCategory = searchParams.get("superCategory");

		const filter = {};
		if (superCategory) {
			filter.superCategory = superCategory;
		}

		const categories = await Category.find(filter);

		return Response.json({ data: categories }, { status: 200 });
	} catch (error) {
		return Response.json({ message: error.message }, { status: 500 });
	}
}
