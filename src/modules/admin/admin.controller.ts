import { catchAsync, sendResponse } from "../../utils";
import adminService from "./admin.service";

// get all faculties
const getAll = catchAsync(async (req, res) => {
  const admins = await adminService.getAll(req.query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data retrieved successfully",
    data: admins,
  });
});

// get single admin
const getSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const admin = await adminService.findByProperty("_id", id);

  if (!admin) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Admin not found",
      data: undefined,
    });
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data retrieved successfully",
    data: admin,
  });
});

// update admin
const updateSingle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const result = await adminService.updateSingle(id, admin);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

// delete admin
const deleteSingle = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await adminService.deleteSingle(id);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export default {
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
};
