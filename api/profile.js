const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
    destination: path.join(process.cwd(), "public/assets"),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    upload.single("dp")(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(500).json({ error: "Profile upload failed" });
        }

        const profile = {
            name: req.body.name || "Anonymous",
            dpUrl: `/assets/${req.file.filename}`,
        };

        res.status(200).json(profile);
    });
    
