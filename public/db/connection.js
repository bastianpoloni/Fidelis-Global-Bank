import pg from 'pg';
import { Sequelize} from 'sequelize';

const { Pool } = pg;

const pool = new Pool({
    user: 'bastianpoloni',
    host: 'localhost',
    database: 'fgb',
    password: '',
    port: 5432
});

pool.connect();

const sequelize = new Sequelize('fgb', 'bastianpoloni', '', {

    dialect: 'postgres',
    logging: false
});

sequelize.sync({alter: true});

export { pool, sequelize };
