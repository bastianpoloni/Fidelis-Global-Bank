import express from "express";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
import { Usuario } from "./models/Usuario.js";
import { Transferencia } from "./models/Transferencia.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import  MethodOverride from "method-override";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const user = new Usuario();
const transferencia = new Transferencia();
const pathUser= './public/user.json';
let loginUser = JSON.parse(fs.readFileSync(pathUser));
let secret = "secreto";
let listaUser = [];

let listaTransferencia = [];

app.use(MethodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
    }  
    try {   
      const decoded = jwt.verify(token, secret);
      console.log(decoded);
      req.id = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ mensaje: "Acceso denegado. Token inválido." });
    }
  };

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/v2/register", (req, res) => {
  res.render("register");
});

app.get("/v2/hub", authMiddleware, async (req, res) => {
    console.log(req.id);
  listaTransferencia = await transferencia.consultarTransferencias(loginUser.id);
  listaUser = await user.consultarUsuarios();
  res.render("hub", { usuarios: listaUser, movimientos: listaTransferencia, loginUser });
});

app.post("/v2/login", async (req, res) => {
  const { rut, password } = req.body;
  const login = await user.consultarUsuario(rut, password);
  console.log(loginUser.id);
  if (!login ) {
    res.status(403).redirect("/");
  }else{
    try {
        fs.writeFileSync(pathUser, JSON.stringify(login));
        const token = jwt.sign(login, secret, { expiresIn: "30m" });
        
        listaUser = await user.consultarUsuarios();
        res.header("Authorization", token).render("hub", { usuarios: listaUser, movimientos: listaTransferencia, loginUser });
      } catch (error) {
        res.status(403).send("Usuario o contraseña incorrectos");
      }
  }
 
});

app.get("/v2/transferencia", async (req, res) => {
    const id = loginUser.id;
    listaTransferencia = await transferencia.consultarTransferencias(id);
    console.log(listaTransferencia);
    res.send(listaTransferencia);
});

app.post("/v2/register", async (req, res) => {
  const { nombre, rut, email, password, confirm } = req.body;
  if (password !== confirm) {
    res.send("Las contraseñas no coinciden");
  }
  try {
    await user.crearUsuario(rut, nombre, email, password);
    res.status(201).send("Usuario registrado");
  } catch (error) {
    res.status(403).redirect("/v2/register");
  }
});

app.post("/v2/transferencia", async (req, res) => {
  try {
    const emisor = loginUser.id;
    const { receptor, monto } = req.body;
    await transferencia.crearTransferencia(emisor, receptor, monto);
    res.status(201).render("hub", { usuarios: listaUser, movimientos: listaTransferencia, loginUser });
  } catch (error) {
    res.status(403);
  }
});

app.put("/v2/update", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    let updatedUser = await user.actualizarUsuario(loginUser.id, nombre, email, password);
    console.log(updatedUser);
    fs.writeFileSync(pathUser, JSON.stringify(updatedUser));
    res.status(201).render("hub", { usuarios: listaUser, movimientos: listaTransferencia, loginUser });
  } catch (error) {
    res.status(403).redirect("/v2/hub");
  }
});

app.delete("/v2/eliminar", async (req, res) => {
  try {
    await user.eliminarUsuario(loginUser.id);
    res.status(201).redirect("/");
  } catch (error) {
    res.status(403).redirect("/v2/hub");
  }
});

app.all("*", (req, res) => {
  res.status(404).render("notFound");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});


