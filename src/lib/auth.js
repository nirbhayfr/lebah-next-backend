// import { verifyToken } from "@/lib/jwt";

// export const getAuthUser = (req) => {
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new Error("No token provided");
//   }

//   const token = authHeader.split(" ")[1];
//   return verifyToken(token); // returns payload {id, email, role}
// };

// export const requireAdmin = (req) => {
//   const user = getAuthUser(req);

//   if (user.role !== "ADMIN") {
//     throw new Error("Admin access required");
//   }

//   return user;
// };

import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function requireAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decode',decoded)
    await connectDB();
    const user = await User.findById(decoded.userId);
    console.log('user',user)
    if (!user) throw new Error("User not found");

    return user;

  } catch (err) {
    throw new Error("Invalid token");
  }
}

export async function requireAdmin(user) {
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
}

