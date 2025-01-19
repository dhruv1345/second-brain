import express from "express";
import { ContentModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Middleware to authenticate JWT
const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, user: any) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden" });
        }

        req.userId = user.userId; // Attach userId to the request
        next();
      }
    );
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Signup route
app.post("/api/v1/auth/signup", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    if ((error as any).code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login route
app.post("/api/v1/auth/login", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Protected content route
app.post("/api/v1/content", authenticateJWT, async (req: any, res: any) => {
  try {
    const { link, type } = req.body;

    if (!link || !type) {
      return res.status(400).json({ message: "Link and type are required." });
    }

    await ContentModel.create({ link, type, userId: req.userId, tags: [] });
    res.status(201).json({ message: "Content created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Dummy GET route for content
app.get("/api/v1/content", authenticateJWT, async (req: any, res: any) => {
  try {
    const contents = await ContentModel.find({ userId: req.userId });
    res.status(200).json(contents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/v1/content", async (req: any, res: any) => {});

app.delete("/api/v1/content", async (req: any, res: any) => {});

app.post("/api/v1/brain/share", async (req: any, res: any) => {});

app.get("/api/v1/brain/:shareLink", async (req: any, res: any) => {});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
