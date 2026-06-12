import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import authRouter from "./auth";
import sellerRouter from "./seller";
import businessesRouter from "./businesses";
import leadsRouter from "./leads";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(sellerRouter);
router.use(businessesRouter);
router.use(leadsRouter);
router.use(analyticsRouter);

export default router;
