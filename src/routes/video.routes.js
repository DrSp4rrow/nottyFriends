const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const videoController = require("../controllers/video.controller");

router.post("/upload", upload.single("video"), videoController.uploadVideo);
router.get("/stream", videoController.streamVideo);
router.get("/mediaInfo", videoController.getMediaInfo);

module.exports = router;
