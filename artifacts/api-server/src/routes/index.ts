import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import authRouter from "./auth";
import sellerRouter from "./seller";
import businessesRouter from "./businesses";
import servicesRouter from "./services";
import leadsRouter from "./leads";
import analyticsRouter from "./analytics";
import adminRouter from "./admin";
import subscriptionsRouter from "./subscriptions";
import videosRouter from "./videos";
import announcementsRouter from "./announcements";
import verificationRouter from "./verification";
import supportRouter from "./support";
import heroSlidesRouter from "./hero-slides";
import savedRouter from "./saved";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(productsRouter);
router.use(servicesRouter);
router.use(videosRouter);
router.use(announcementsRouter);
router.use(verificationRouter);
router.use(supportRouter);
router.use(heroSlidesRouter);
router.use(savedRouter);
router.use(sellerRouter);
router.use(businessesRouter);
router.use(leadsRouter);
router.use(analyticsRouter);
router.use(subscriptionsRouter);
router.use(adminRouter);

export default router;
