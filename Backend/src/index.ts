import express from 'express';
import { buildBereichRouter } from './routes/bereicheRoutes';
import { InMemoryBereichRepository } from './repositories/InMemoryBereicheRepository';
import { BereicheRepository } from './repositories/BereicheRepository';

const app = express();
const port = 3000;

app.use(express.json());

// Instantiate your repository
const bereichRepo = new InMemoryBereichRepository();

// Attach the router
app.use('/api/bereiche', buildBereichRouter(bereichRepo)); // ✅ this is the correct form

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
