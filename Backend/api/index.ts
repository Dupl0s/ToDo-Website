import express from 'express';

/* Im Terminal im Verzeichnis /Backend mit npm start Server auf Port 3000 starten, dann im /Frontend ng serve --proxy-config proxy.conf.json*/

const app = express();

app.get("/", (_req, res) => { 
  res.json({message: "Backend Server is running"});
});

const Port = 3000

app.listen(Port);
console.log("Server started at http://localhost:" + Port);
