export const schema = {
    create: [
        `CREATE TABLE cards(
            id BIGSERIAL PRIMARY KEY,
            name TEXT,
            details JSONB           
        )`
    ],
    drop: [
        `DROP TABLE IF EXISTS cards`
    ]
}

export async function insert(pg, ...data) {
    const name = data[0]
    const details = JSON.stringify(data[1])

    return pg.rows(
        `INSERT INTO cards(name, details) VALUES ($1, $2) RETURNING id`, name, details
    )
}

export async function update(pg, id, ...data) {
    const name = data[0]
    const details = JSON.stringify(data[1])

    return pg.rows(
        `UPDATE cards SET name = ($1), details = ($2) WHERE id = ($3)`, name, details, id
    )
}

export async function retrieve(pg, id) {
    return pg.rows(
        `SELECT name, details FROM cards WHERE id = ($1)`, id
    )
}

export async function retrieveAll(pg) {
    return pg.rows(
        `SELECT id, name, details FROM cards`
    )
}