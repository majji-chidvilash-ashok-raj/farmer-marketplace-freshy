import jwt from "jsonwebtoken"

const Token = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default Token;
