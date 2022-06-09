// import PgAsync from 'pg-async';
import knex from 'knex';
import once from 'once';

async function setup(pg, schema) {
  const { drop, create } = schema;

  if (drop) {
    for (const q of drop) {
      await pg.raw(q);
    }
  }

  if (create) {
    for (const q of create) {
      await pg.raw(q);
    }
  }

  // await pg.transaction(async (tx) => {
  //   const { drop, create } = schema;

  //   if (drop) {
  //     for (const q of drop) {
  //       await tx.raw(q);
  //       await tx.commit();
  //     }
  //   }

  //   if (create) {
  //     for (const q of create) {
  //       await tx.raw(q);
  //       await tx.commit();
  //     }
  //   }
  // });
}

export function postgresMiddleware(schema) {
  const pg = knex({connection: `postgres://user:password@database/amagi`, client: 'pg'})
  const setupSchema = once(setup)
  
  return async (ctx, next) => {
    await setupSchema(pg, schema);

    ctx._postgres = pg;

    return await next();
  };
}

export function postgres(ctx) {
  return ctx._postgres;
}
