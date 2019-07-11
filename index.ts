
import { readSync } from "node-yaml";
import * as express from "express";
import { Channel } from "./interfaces/Channel";
import { Chat } from "./models/Chat";
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors')


const config: { channels: Channel[] } = readSync("./config/config");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(cookieParser());



app.get("/healthz", (req, res) => {
    res.status(200).send(`Prom2GoogleChat is running`);
})

app.post("/", (req, res) => {
    console.log('recieved alert');
    console.log(JSON.stringify(req.body))
    for (let channel of config.channels) {
        const chat = new Chat(req.body, channel);
        chat.send();
    }
    res.status(200).json({});
})

app.listen(process.env.port || 3000, () => {
    console.log("Prom2GoogleChat started listening");
});

