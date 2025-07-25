// It is used to handle async errors in Express.js routes without using try-catch blocks.
const asyncHandler=(requestHandler)=>{
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export default asyncHandler