import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: erorr.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: erorr.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Passwords do not match" });
  const hashPassword = await argon2.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "User created" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  // ambil data user simpan di variabel user
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ msg: "User not found" });
  // jika user ditemukan
  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;
  // validasi jika password tidak diisi, maka password tidak akan diupdate
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    // jika password diisi, maka password akan diupdate
    hashPassword = await argon2.hash(password);
  }
  // jika password tidak sama dengan password lama, maka return error
  if (password !== confPassword)
    return res.status(400).json({ msg: "Passwords do not match" });
  // jika semua validasi terpenuhi, maka update user dengan id yang diberikan
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: { id: user.id },
      }
    );
    res.status(200).json({ msg: "User updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  // ambil data user simpan di variabel user
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  // jika user tidak ditemukan
  if (!user) return res.status(404).json({ msg: "User not found" });
  // jika user ditemukan
  try {
    await Users.destroy({
      where: { id: user.id },
    });
    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
