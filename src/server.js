const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");
const cors = require("cors");
const mime = require("mime");

app.use(express.static("src/public"));
app.use(cors());

app.get("/", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.sendFile(__dirname + "/index.html");
});

app.get("/list-videos", (req, res) => {
  const dir = "src/public/videos/";
  var files = fs.readdirSync(dir);

  res.set("Cache-Control", "no-store");
  res.send(
    files.map((f, i) => {
      const type = mime.getType(`${dir}${f}`);

      return {
        id: i,
        file: f,
        type,
      };
    })
  );
});

app.get("/update-sensor", (req, res) => {
  console.log(`pinged at: ${Date.now()}`);
  io.emit("ping");

  res.sendStatus(200);
});

io.on("connection", (socket) => {
  sock = socket;
  console.log("a user connected");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
