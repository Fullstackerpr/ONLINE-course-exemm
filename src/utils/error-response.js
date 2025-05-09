import logger from "./logger/logger.js"

export const catchError = (res, code, err) => {
    logger.error(`dangg: ${err}`);
    return res.status(code).json({
        statusCode: code,
        message: err
    });
};
