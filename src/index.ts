import { Hono } from 'hono';
import rootFeature from './features/root';
import healthFeature from './features/health';
import anekalogamFeature from './features/anekalogam';
import hargaEmasOrgFeature from './features/hargaemas-org';
import lakuemasFeature from './features/lakuemas';

const app = new Hono();

app.route('/', rootFeature);
app.route('/health', healthFeature);

app.route('/api/prices/anekalogam', anekalogamFeature);
app.route('/api/prices/hargaemas-org', hargaEmasOrgFeature);
app.route('/api/prices/lakuemas', lakuemasFeature);

export default app;
