export const success = (res, data, message = "OK", code = 200) => {
    return res.status(code).json({
        status: "success",
        code,
        message,
        data,
    });
};

export const error = (res, message = "Something went wrong", code = 500) => {
    return res.status(code).json({
        status: "error",
        code,
        message,
    });
};
