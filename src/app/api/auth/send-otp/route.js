import { connectDB } from "@/lib/db";
import { createResponse, ErrorResponse } from "@/lib/responseWrapper";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
     await connectDB();
    let { email } = await req.json();

    if (!email) {
      return Response.json(ErrorResponse(400, "Email is required"), { status: 400 });
    }

    email = email.toLowerCase().trim();
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (user?.otpExpiry && user.otpExpiry > Date.now()) {
      return Response.json({
        status: "error",
        message: "Please wait before resending OTP",
      },
      { status: 429 }
    );
    }

    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    await sendOtpEmail(email, otp);

    return Response.json(createResponse(200, null, "OTP sent successfully"));
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return Response.json(ErrorResponse(500, "Internal server error"), { status: 500 });
  }
}
