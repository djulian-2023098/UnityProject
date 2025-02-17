import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 6 * 1000,
    max: 200,
    message:{
        message: 'Your blocked, wait 15 minutes'
    }
})