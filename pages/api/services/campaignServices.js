const ffmpeg = require('fluent-ffmpeg');

const getVideoDurationFromUrl = (videoUrl) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoUrl, (err, metadata) => {
            if (err) return reject(err);
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
};

module.exports = {getVideoDurationFromUrl}