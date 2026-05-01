import { Hono } from 'hono';
import rootFeature from './features/root';
import healthFeature from './features/health';

const app = new Hono();

app.route('/', rootFeature);
app.route('/health', healthFeature);

export default app;
