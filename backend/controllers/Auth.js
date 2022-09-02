import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
  // ambil data user simpan di variabel user dengan berdasarkan email
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ msg: "User not found" });
  // jika user ditemukan cocokkan password
  const match = await argon2.verify(user.password, req.body.password);
  // jika password tidak cocok
  if (!match) return res.status(400).json({ msg: "Password is incorrect" });
  // jika password cocok, set session
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ uuid, name, email, role });
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Logout failed" });
    res.status(200).json({ msg: "Logout success" });
  });
};

export const getSession = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please login" });
  }
  const user = await Users.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json(user);
};
