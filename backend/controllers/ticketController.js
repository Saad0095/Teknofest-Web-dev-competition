import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";

const VALID_STATUSES = ["Open", "In Progress", "Resolved"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

// Create new ticket
export const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;
    const userId = req.user.id;

    if (!subject || !description || !category || !priority) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!subject.trim()) {
      return res.status(400).json({ message: "Subject cannot be empty" });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const existing = await Ticket.findOne({
      subject: subject.trim(),
      userId,
    });

    if (existing) {
      return res.status(409).json({
        message: "Ticket with this subject already exists",
      });
    }

    const ticket = await Ticket.create({
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority,
      userId,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticketId: ticket._id,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

// Get all tickets
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ tickets });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};


// Get ticket by id
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

// Update ticket 
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, description, category, priority, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (subject !== undefined) {
      if (!subject.trim()) {
        return res.status(400).json({ message: "Subject cannot be empty" });
      }
      ticket.subject = subject.trim();
    }

    if (description !== undefined) {
      ticket.description = description.trim();
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: "Invalid priority" });
      }
      ticket.priority = priority;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      ticket.status = status;
    }

    if (category !== undefined) ticket.category = category;

    await ticket.save();

    res.status(200).json({
      message: "Ticket updated successfully",
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Delete ticket error:", error);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};

// Get stats
export const getTicketStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Ticket.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      total: 0,
    };

    stats.forEach((s) => {
      formatted[s._id] = s.count;
      formatted.total += s.count;
    });

    res.status(200).json({ stats: formatted });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};
