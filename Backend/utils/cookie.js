export const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    maxAge: 60 * 60 * 1000 // 1 hour
  });
};

export const clearTokenCookie = (res) => {
  res.clearCookie("token");
};
