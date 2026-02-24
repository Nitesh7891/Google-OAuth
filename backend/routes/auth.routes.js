import { Router } from "express";
import { googleAuthLogin } from "../controllers/auth.controller.js";

export const authRouter=Router();

authRouter.get('/google',googleAuthLogin)