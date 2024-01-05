import {sequelize, pool} from '../public/db/connection.js';
import { DataTypes } from 'sequelize';

const transferencias = sequelize.define('transferencias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    emisor: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false
    },
    receptor: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false
    },
    monto: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
});

export class Transferencia {
    constructor() {
        this.id ;
        this.emisor;
        this.receptor;
        this.monto;
    }

    async crearTransferencia(emisor,receptor,monto){
        
        const montoEmisor = await pool.query('SELECT balance FROM usuarios WHERE id = $1', [emisor]);
        console.log(emisor,receptor,monto);
        if(montoEmisor.rows[0].balance < monto){
            throw new Error('Saldo insuficiente');
        }else{
            await transferencias.create({emisor,receptor,monto});
            await pool.query('UPDATE usuarios SET balance = balance - $1 WHERE id = $2', [monto,emisor]);
            await pool.query('UPDATE usuarios SET balance = balance + $1 WHERE id = $2', [monto,receptor]);
        }
        
    }

    async consultarTransferencias(emisor){
        const res = await pool.query('SELECT * FROM transferencias WHERE emisor = $1', [emisor]);
        return res.rows;
    }
}