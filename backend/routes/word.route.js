import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
    addWord,
    getAllWords,
    getUserWords,
    deleteWord,
    updateWord,
    searchWords,
    bulkUploadJSON
} from "../controllers/word.controller.js";

const router = express.Router();

router.route("/add").post(isAuthenticated, upload.single('image'), addWord);
router.route("/all").get(isAuthenticated, getAllWords);
router.route("/user").get(isAuthenticated, getUserWords);
router.route("/search").get(isAuthenticated, searchWords);
router.route("/:id").delete(isAuthenticated, deleteWord);
router.route("/:id").put(isAuthenticated, upload.single('image'), updateWord);

// Bulk JSON Upload route
router.post("/bulk-upload-json", isAuthenticated, ...bulkUploadJSON);

export default router;
