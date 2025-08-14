import { ApiResponse } from "../utils/api-response.js";
// import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js";


// alternative of this is asyncHandler...
/*
const healthCheck = async (req, res, next) => {
  try {
  // getUserFromDB is imaginary functiom
    const user = await getUserFromDB();
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is Healthy" }));
  } catch (error) {
    next(error);
  }
};
*/

const healthCheck = asyncHandler(async (req,res) => {
    res.status(200).json(
        new ApiResponse(200, {message: "Server is Running"})
    )
});

export { healthCheck };
