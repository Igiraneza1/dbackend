import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folder;

    if (file.fieldname === "videos") {
      folder = "videos";
    } else if (file.fieldname === "documents") {
      folder = "documents";
    } else if (
      file.fieldname === "images" ||
      file.fieldname === "imagePreview"
    ) {
      folder = "images";
    } else {
      throw new Error("Invalid field name"); 
    }

    return {
        folder: folder, 
        resource_type: "auto", 
        public_id:` ${Date.now()}-${file.originalname.split(".")[0]},`
      };
    },
  });


const configureMulter = () => {
  const upload = multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024, 
    },
    fileFilter(req, file, cb) {
      const allowedFormats = {
        videos: ["video/mp4", "video/mpeg", "video/mp3"],
        documents: [
          "application/pdf",
          "application/ppt",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        images: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg"],
        imagePreview: ["image/jpeg", "image/png"], 
      };

      
      if (
        allowedFormats[file.fieldname] &&
        allowedFormats[file.fieldname].includes(file.mimetype)
      ) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"), false); // Reject the file
      }
    },
  }).fields([
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 5 },
    { name: "images", maxCount: 5 },
    { name: "imagePreview", maxCount: 5 }, // Ensure this matches your frontend
  ]);

  return upload;
};

export default configureMulter;