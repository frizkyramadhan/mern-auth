import { Sequelize } from "sequelize";

const db = new Sequelize("auth_db", "root", "SkyF1sh2020", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
