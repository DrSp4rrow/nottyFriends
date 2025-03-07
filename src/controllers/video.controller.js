const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
require("dotenv").config();

ffmpeg.setFfmpegPath(ffmpegPath);

exports.uploadVideo = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("No se subió ningún archivo.");
    }

    const newFileName = file.filename;
    const newPath = path.join(
        __dirname,
        "../../",
        process.env.UPLOADS_DIR,
        newFileName
    );
    fs.renameSync(file.path, newPath);

    res.json({ filename: newFileName });
};

exports.streamVideo = (req, res) => {
    const { filename } = req.query;
    const filepath = path.join(
        __dirname,
        "../../",
        process.env.UPLOADS_DIR,
        filename
    );

    if (!fs.existsSync(filepath)) {
        return res.status(404).send("Archivo no encontrado.");
    }

    res.sendFile(filepath);
};

exports.getMediaInfo = (req, res) => {
    const { filename } = req.query;
    const filepath = path.join(
        __dirname,
        "../../",
        process.env.UPLOADS_DIR,
        filename
    );

    if (!fs.existsSync(filepath)) {
        return res.status(404).send("Archivo no encontrado.");
    }

    ffmpeg(filepath).ffprobe((err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al analizar el archivo.");
        }

        const audioTracks = data.streams.filter(
            (s) => s.codec_type === "audio"
        );
        const subtitles = data.streams.filter(
            (s) => s.codec_type === "subtitle"
        );

        res.json({
            audioTracks: audioTracks.map((track) => ({
                language: track.tags?.language || "Desconocido",
            })),
            subtitles: subtitles.map((track) => ({
                language: track.tags?.language || "Desconocido",
            })),
        });
    });
};
