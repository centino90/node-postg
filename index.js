import koa from 'koa';
import Router from 'koa-router';
import jsonBody from 'koa-json-body';
import * as swagger from 'swagger2';
import swagger2Koa from 'swagger2-koa';

const { ui, validate } = swagger2Koa;

import { postgresMiddleware, postgres } from './postgres.js';
import { schema, insert, retrieve, retrieveAll, update } from './model.js';

const spec = swagger.loadDocumentSync('./swagger.yaml');

if (!swagger.validateDocument(spec)) {
  throw Error('Invalid Swagger File');
}

const app = new koa().use(jsonBody()).use(postgresMiddleware(schema));

const router = new Router({ prefix: '/v1' });

router
  .post('/cards', async (ctx) => {
    const data = ctx.request.body;

    const id = await insert(postgres(ctx), data.name, data.details);

    ctx.status = 200;
    ctx.body = {
      message: id[0].id
    };
  })
  .put('/cards/:id', async (ctx) => {
    const data = ctx.request.body;
    await update(postgres(ctx), ctx.params.id, data.name, data.details);

    ctx.status = 204;
  })
  .get('/cards/:id', async (ctx) => {
    const data = await retrieve(postgres(ctx), ctx.params.id);

    ctx.status = 200;
    ctx.body = data[0];
  })
  .get('/cards', async (ctx) => {
    console.log('get cards');
    const data = await retrieveAll(postgres(ctx));

    ctx.status = 200;
    ctx.body = data;
  });

app.use(validate(spec));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(ui(spec, '/docs'));

app.listen(8080, console.log('Server up on 8080'));
