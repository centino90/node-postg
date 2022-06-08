import koa from 'koa';
import Router from 'koa-router';
import jsonBody from 'koa-json-body';

import { postgresMiddleware, postgres } from './postgres.js';
import { schema, insert, retrieve, retrieveAll, update } from './model.js';

const app = new koa().use(jsonBody()).use(postgresMiddleware(schema));

const router = new Router();

router.get('/test', async (ctx) => {
  console.log('test');
});

router
  .post('/cards', async (ctx) => {
    console.log('cards')
    const data = ctx.request.body;
    const id = await insert(postgres(ctx), data.name, data.details);

    ctx.status = 200;
    ctx.body = id[0].id;
  })
  .put('/cards/:id', async (ctx) => {
    const data = ctx.request.body;
    await update(postgres(ctx), data.name, ctx.params.id);

    ctx.status = 204;
  })
  .get('/cards/:id', async (ctx) => {
    const data = await retrieve(postgres(ctx), ctx.params.id);

    ctx.status = 200;
    ctx.body = data[0];
  })
  .get('/cards', async (ctx) => {
    console.log('get cards')
    const data = await retrieveAll(postgres(ctx));

    ctx.status = 200;
    ctx.body = data;
  });

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8080, console.log('Server up on 8080'));
