require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { appData } = require("./mock");
const app = express();
const PORT = process.env.PORT || 8000;

const audio_type = {
    ROCK: "rock",
    JAZZ: "jazz",
    CINEMATIC: "cinematic",
    ACCOUSTIC: "accoustic"
}

function getDirectories(type) {
    return fs.readdirSync(`./music/${type}`);
}

function getSongDetails(type, dir) {
    try {
        const path = `music/${type}/${dir}/media`;
        const audioData = fs.readdirSync(path);
        const audioInfo = fs.readFileSync(`./music/${type}/${dir}/info.json`);
        const parsedData = JSON.parse(audioInfo);
        return {
            audioFile: `${path}/${audioData[0]}`,
            avatar: `${path}/${audioData[1]}`,
            ...parsedData
        }
    } catch (error) {
        return false;
    }
}

app.use(cors());
app.use('/music', express.static('music'));

app.get(`/song`, (req, res) => {
    const songData = {};
    for (let type in audio_type) {
        const directoryItems = getDirectories(audio_type[type]);
        directoryItems.forEach((item) => {
            const audioData = getSongDetails(audio_type[type], item);
            console.log({ audioData })
            if (audioData) {
                if (audio_type[type] in songData) {
                    songData[audio_type[type]].push(audioData);
                } else {
                    songData[audio_type[type]] = [audioData];
                }
            }
        })
    }
    appData['freelicense'] = songData

    res.status(200).json({ appData });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})