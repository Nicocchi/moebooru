import { Request } from "express";
import multer, { diskStorage, FileFilterCallback } from "multer";

const imageDir = process.env.IMAGE_DIR || "public/";

type DestinationCallback = (err: Error | null, destination: string) => void;
type FileNameCallback = (err: Error | null, filename: string) => void;

const fileStorage = diskStorage({
  destination: (
    _req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    cb(null, imageDir);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const fileUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("file");
