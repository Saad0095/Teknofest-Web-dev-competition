import express from "express";
import {
  createTicket,
  getUserTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketStats,
} from "../controllers/ticketController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createTicket);
router.get("/", getUserTickets);
router.get("/stats", getTicketStats);

router.get("/:id", getTicketById);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
