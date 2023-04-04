import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

const serverclient = StreamChat.getInstance(api_key, api_secret);

app.post("/signup", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (name === "" || username === "" || password === "")
      return res.json({ message: "Please enter details" });

    const { users } = await serverclient.queryUsers({ name: username });

    if (users.length === 0) {
      const message = "";
      const userId = uuidv4();
      const salt = bcrypt.genSaltSync(10);
      const hashedpassword = bcrypt.hashSync(password, salt);
      const token = serverclient.createToken(userId);

      res.json({ token, userId, name, username, hashedpassword, message });
    } else {
      res.json({ message: "Username is not available." });
    }
  } catch (e) {
    res.json(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverclient.queryUsers({ name: username });
    const message = "";
    
    if (password === "" || username === "")
      return res.json({ message: "Please enter details" });
    if (users.length === 0) return res.json({ message: "User not found" });

    const token = serverclient.createToken(users[0].id);
    const passwordmatched = await bcrypt.compareSync(
      password,
      users[0].hashedpassword
    );

    if (passwordmatched) {
      res.json({
        token,
        name: users[0].name,
        username,
        userId: users[0].id,
        message,
      });
    } else {
      res.json({ message: "Credential not matches" });
    }
  } catch (e) {
    res.json(e);
  }
});

app.get("*", (req, res) => {
  res.json({
    message: "bad request",
  });
});

app.listen(process.env.PORT, () => {
  console.log("app is runing on port 5000");
});
