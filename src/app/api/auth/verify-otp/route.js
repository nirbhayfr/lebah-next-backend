import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
      await connectDB();
    let { email, otp, name } = await req.json();
    email = email.toLowerCase().trim();

    if (!email || !otp) {
      return Response.json({
        status: "error",
        message: "Email and OTP are required",
      },
      { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({
        status: "error",
        message: "User not found",
      },
      { status: 404 });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return Response.json({
        status: "error",
        message: "Invalid OTP",
      },
      { status: 400 });
    }

    if (user.otpExpiry < Date.now()) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return Response.json({
        status: "error",
        message: "OTP expired",
      },
      { status: 400 });
    }

    // ✅ SAVE NAME ON FIRST LOGIN
    if (name && !user.name) {
      user.name = name;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return Response.json({
      status: "success",
      message: "OTP verified successfully",
      token,
      role: user.role,
      name: user.name, // ✅ SEND NAME BACK
      isProfileComplete: !!user.name,
    },
    { status: 200 });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return Response.json({
      status: "error",
      message: "Internal server error",
    },
    { status: 500 });
  }
}
