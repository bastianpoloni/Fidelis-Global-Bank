
import { DataTypes } from 'sequelize';
import {sequelize, pool} from '../public/db/connection.js';

const usuarios = sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 100000
    }
}); 

export class Usuario {
    constructor() {
        this.id ;
        this.rut;
        this.nombre ;
        this.email;
        this.password;
        this.balance;
    }

    async crearUsuario(rut,nombre,email,password){
        await usuarios.create({rut,nombre,email,password});
    };

    async consultarUsuario(rut,password){
        const res = await pool.query('SELECT id,rut,nombre,email,balance FROM usuarios WHERE rut = $1 AND password = $2', [rut,password]);
        //console.log(res.rows[0]);
        return res.rows[0];
        
    }

    async consultarUsuarios(){
        const res = await usuarios.findAll();
        return res; 
    }

    async actualizarUsuario(id,nombre,email,password){

       //const res = await usuarios.update({nombre,email,password}, {where: {id}});
        await pool.query('UPDATE usuarios SET nombre = $1, email = $2, password = $3 WHERE id = $4', [nombre,email,password,id]);
        let updated = await pool.query('SELECT id,rut,nombre,email,balance FROM usuarios WHERE id = $1', [id]);
        return updated.rows[0];
    }
   
    async eliminarUsuario(id){
        await usuarios.destroy({where: {id}});
    }

    
}