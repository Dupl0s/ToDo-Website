import express from 'express';

/* Im Terminal im Verzeichnis /Backend mit npm start Server auf Port 3000 starten, dann im /Frontend ng serve --proxy-config proxy.conf.json*/

const app = express();
const Port = 3000;

app.use(express.json());

app.get("/api/backend", (_req, res) => { 
  res.json({message: "Backend Server is running"});
});



app.listen(Port);
console.log("Server started at http://localhost:" + Port);
