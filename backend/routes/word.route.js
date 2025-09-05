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
<<<<<<< HEAD
    bulkUploadJSON,
    getTopics
=======
    bulkUploadJSON
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
} from "../controllers/word.controller.js";

const router = express.Router();

router.route("/add").post(isAuthenticated, upload.single('image'), addWord);
router.route("/all").get(isAuthenticated, getAllWords);
router.route("/user").get(isAuthenticated, getUserWords);
router.route("/search").get(isAuthenticated, searchWords);
<<<<<<< HEAD
router.route("/topics").get(isAuthenticated, getTopics);
=======
>>>>>>> cb49ee8418adf8ecf637648a7497a9d945b1cd7e
router.route("/:id").delete(isAuthenticated, deleteWord);
router.route("/:id").put(isAuthenticated, upload.single('image'), updateWord);

// Bulk JSON Upload route
router.post("/bulk-upload-json", isAuthenticated, ...bulkUploadJSON);

export default router;
