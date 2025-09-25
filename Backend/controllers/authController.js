import * as authService from "../services/authService.js"
import { setTokenCookie ,clearTokenCookie} from "../utils/cookie.js"
import { generateJwtToken } from "../utils/jwt.js"

export const signup=async(req,res)=>{
    try {
        const user= await authService.signup(req.body)
        const jwtToken = generateJwtToken({ id: user._id, name: user.name, email: user.email })
        setTokenCookie(res, jwtToken)
        res.status(201).json({id:user._id,name:user.name,email:user.email,jwtToken})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

export const login=async(req,res)=>{
    try {
        const {user,jwtToken}=await authService.login(req.body)
        setTokenCookie(res,jwtToken)
        res.json({id:user._id, name:user.name,email:user.email,jwtToken})
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}
export const logout = (req, res) => {
  try {
    clearTokenCookie(res);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};
export const getCurrentUser = (req, res) => {
  try {
        if (!req.user) {
      return res.status(401).json({ error: "Not logged in" });
    }
    const { id, name, email } = req.user;
    res.json({ id, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

