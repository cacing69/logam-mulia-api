import { Hono } from 'hono';
import rootFeature from './features/root';
import healthFeature from './features/health';
import anekalogamFeature from './features/anekalogam';

const app = new Hono();

app.route('/', rootFeature);
app.route('/health', healthFeature);

app.route('/api/prices/anekalogam', anekalogamFeature);

export default app;
