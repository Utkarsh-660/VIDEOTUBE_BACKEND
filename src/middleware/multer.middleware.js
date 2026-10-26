import multer from "multer";
import { Apierror } from "../utils/api-error.js";

const storage=multer.memoryStorage()
const fileFilter = (req, file, cb) => {
     
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "image/webp",
        "application/octet-stream",
        "video/mp4"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    } else {
        return cb(
            new Apierror(400, "Only images and PDFs are allowed"),
            false
        );
    }
};
const upload=multer({
    storage:storage,
    limits:{fileSize:1000 * 1024 * 1024} ,
    fileFilter:fileFilter
})
export default upload;