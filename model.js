export const schema = {
  create: [
    `CREATE TABLE cards(
            id BIGSERIAL PRIMARY KEY,
            name TEXT,
            details JSONB           
        )`,
  ],
  drop: [`DROP TABLE IF EXISTS cards`],
};

export async function insert(pg, ...data) {
  const name = data[0];
  const details = JSON.stringify(data[1]);

  return pg('cards').insert(
    {
      name: name,
      details: details,
    },
    ['id']
  );
}

export async function update(pg, id, ...data) {
  const name = data[0];
  const details = JSON.stringify(data[1]);

  return pg('cards').where({ id: id }).update({
    name: name,
    details: details,
  });
}

export async function retrieve(pg, id) {
  return pg.select('name', 'details').from('cards').where({ id: id });
}

export async function retrieveAll(pg) {
  return pg.select('name', 'details').from('cards');
}
