import express from 'express';
import bodyParser from 'body-parser';
import { buildBereichRouter } from './routes/bereicheRoutes';
import { InMemoryBereichRepository } from './repositories/InMemoryBereichRepository';
import { BereichRepository } from './repositories/BereichRepository';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const repo = new InMemoryBereichRepository();


app.use('/api/bereiche', buildBereichRouter(repo));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





