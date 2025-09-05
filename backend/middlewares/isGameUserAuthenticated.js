import jwt from "jsonwebtoken";

const isGameUserAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.gameToken;
        if (!token) {
            return res.status(401).json({
                message: 'Game user not authenticated',
                success: false
            });
        }
        
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false
            });
        }
        
        req.gameUserId = decode.gameUserId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Authentication failed',
            success: false
        });
    }
};

export default isGameUserAuthenticated;