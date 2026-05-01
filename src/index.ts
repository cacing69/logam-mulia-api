import { Hono } from 'hono';
import type { Bindings } from './types';
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
import logammuliaFeature from './features/logammulia';
import emaskuFeature from './features/emasku';
import hartadinataabadiFeature from './features/hartadinataabadi';
import galeri24Feature from './features/galeri24';
import sampoernagoldFeature from './features/sampoernagold';

const app = new Hono<{ Bindings: Bindings }>();

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
app.route('/api/prices/logammulia', logammuliaFeature);
app.route('/api/prices/emasku', emaskuFeature);
app.route('/api/prices/hartadinataabadi', hartadinataabadiFeature);
app.route('/api/prices/galeri24', galeri24Feature);
app.route('/api/prices/sampoernagold', sampoernagoldFeature);

export default app;
