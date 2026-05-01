import { Hono } from 'hono';
import rootFeature from './features/root';
import healthFeature from './features/health';
import anekalogamFeature from './features/anekalogam';
import hargaEmasOrgFeature from './features/hargaemas-org';
import lakuemasFeature from './features/lakuemas';
import pegadaianFeature from './features/pegadaian';
import sakumasFeature from './features/sakumas';
import kursdolarFeature from './features/kursdolar';
import cermatiFeature from './features/cermati';
import bankbsiFeature from './features/bankbsi';
import brankaslmFeature from './features/brankaslm';
import indogoldFeature from './features/indogold';
import hargaemasNetFeature from './features/hargaemas-net';
import hargaemasComFeature from './features/hargaemas-com';
import treasuryFeature from './features/treasury';

const app = new Hono();

app.route('/', rootFeature);
app.route('/health', healthFeature);

app.route('/api/prices/anekalogam', anekalogamFeature);
app.route('/api/prices/hargaemas-org', hargaEmasOrgFeature);
app.route('/api/prices/lakuemas', lakuemasFeature);
app.route('/api/prices/pegadaian', pegadaianFeature);
app.route('/api/prices/sakumas', sakumasFeature);
app.route('/api/prices/kursdolar', kursdolarFeature);
app.route('/api/prices/cermati', cermatiFeature);
app.route('/api/prices/bankbsi', bankbsiFeature);
app.route('/api/prices/brankaslm', brankaslmFeature);
app.route('/api/prices/indogold', indogoldFeature);
app.route('/api/prices/hargaemas-net', hargaemasNetFeature);
app.route('/api/prices/hargaemas-com', hargaemasComFeature);
app.route('/api/prices/treasury', treasuryFeature);

export default app;
