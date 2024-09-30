import multer from "multer";
import path from "path"
import {fileURLToPath} from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const tempPath = path.join(__dirname, "tmp")

const tempPath = path.join("tmp");

const storage = multer.diskStorage({
    destination: tempPath,
    filename: (_req, file, cb) => {
        // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        // cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
        cb(null, file.originalname)
    },
});
export const upload = multer({ storage }); //storage: storage
