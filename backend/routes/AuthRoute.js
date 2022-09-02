import express from "express";
import { login, logout, getSession } from "../controllers/Auth.js";

const router = express.Router();

router.get("/getSession", getSession);
router.post("/login", login);
router.delete("/logout", logout);

export default router;
