import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAuth, requireAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    
    const authUser = await requireAuth(req);
    await requireAdmin(authUser);

    const { email } = await req.json();

    // 1️⃣ Validate email
    if (!email) {
      return Response.json(
        {
          status: "error",
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    // 2️⃣ Find existing user
    const user = await User.findOne({ email });

    // 3️⃣ Must exist
    if (!user) {
      return Response.json(
        {
          status: "error",
          message: "User not found. Ask user to login once.",
        },
        { status: 404 }
      );
    }

    // 4️⃣ Already admin?
    if (user.role === "ADMIN") {
      return Response.json(
        {
          status: "error",
          message: "User is already an admin",
        },
        { status: 400 }
      );
    }

    // 5️⃣ Upgrade role
    user.role = "ADMIN";
    await user.save();

    return Response.json(
      {
        status: "success",
        message: "Admin created successfully",
        adminId: user._id,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    return Response.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
