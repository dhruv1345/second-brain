import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";

const app = express();

app.use(express.json());

app.post("/api/v1/auth/signup", async (req: any, res: any) => {
    const username = req.query.username;
    const password = req.query.password;
    
    await UserModel.create({
        username: username, password: password
    })
    res.json({ message: "User created successfully" });
});

app.post("/api/v1/auth/login", async (req: any, res: any) => {
    const username = req.query.username;
    const password = req.query.password;    



});


app.get("/api/v1/content", async (req: any, res: any) => {
  
  
});

app.delete("/api/v1/content", (req: any, res: any) => {});

app.get("/api/v1/brain/share", (req: any, res: any) => {});

app.get("/api/v1/brain/:shareLink", (req: any, res: any) => {});


app.listen(3000);