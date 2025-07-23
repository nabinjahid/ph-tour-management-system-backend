import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/midlewares/globalErrorHandler";
import notFound from "./app/midlewares/notFound";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import "./app/config/passport";
import { envVars } from "./app/config/env";

const app = express();

app.use(expressSession({
    secret: envVars.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// User routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Management Server",
  });
});

// Global error handler
app.use(globalErrorHandler);

// Not found route
app.use(notFound);

export default app;
