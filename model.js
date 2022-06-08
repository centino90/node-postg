export const schema = {
    create: [
        `CREATE TABLE cards(
            id BIGSERIAL PRIMARY KEY,
            name TEXT
        )`
    ],
    drop: [
        `DROP TABLE IF EXISTS cards`
    ]
}

export async function insert(pg, data) {
    const values = JSON.stringify(data)

    return pg.rows(
        `INSERT INTO cards(name) VALUES ($1) RETURNING id`, data
    )
}

export async function update(pg, data, id) {
    return pg.rows(
        `UPDATE cards SET name = ($1) WHERE id = ($2)`, data, id
    )
}

export async function retrieve(pg, id) {
    return pg.rows(
        `SELECT name FROM cards WHERE id = ($1)`, id
    )
}

export async function retrieveAll(pg) {
    return pg.rows(
        `SELECT id, name FROM cards`
    )
}