import express from "express";
import { UserModel } from "./db";

const app = express();
app.use(express.json());

app.post("/api/v1/auth/signup", async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const newUser = await UserModel.create({ username, password });
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

app.post("/api/v1/auth/login", async (req: any, res: any) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  res.json({ message: "Login route is under construction." });
});

app.post("/api/v1/content", async (req: any, res:any)=>{
  const link = req.body.link;
  const type = req.body.type;
});

app.get("/api/v1/content", async (req: any, res:any)=>{

});

app.delete("/api/v1/content", async (req: any, res:any)=>{

});

app.post("/api/v1/brain/share", async (req: any, res:any)=>{

});

app.get("/api/v1/brain/:shareLink", async (req: any, res:any)=>{

});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
