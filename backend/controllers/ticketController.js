import Ticket from "../models/Ticket.js";

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;
    const userId = req.user.id;

    if (!subject || !description || !category || !priority) {
      return res.status(400).json({
        message: "Please provide all required fields (subject, description, category, priority)",
      });
    }

    if (subject.trim() === "") {
      return res.status(400).json({
        message: "Subject cannot be empty",
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
    //   ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({
      message: error.message || "Failed to create ticket",
    });
  }
};

// Get all tickets for a user
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const tickets = await Ticket.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch tickets",
    });
  }
};

// Get a single ticket
export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ticket = await Ticket.findOne({ _id: id, userId });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket retrieved successfully",
      ticket,
    });
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch ticket",
    });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, description, category, priority, status } = req.body;
    const userId = req.user.id;

    const ticket = await Ticket.findOne({ _id: id, userId });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (subject !== undefined) ticket.subject = subject.trim();
    if (description !== undefined) ticket.description = description.trim();
    if (category !== undefined) ticket.category = category;
    if (priority !== undefined) ticket.priority = priority;
    if (status !== undefined) ticket.status = status;

    await ticket.save();

    res.status(200).json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({
      message: error.message || "Failed to update ticket",
    });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const ticket = await Ticket.findOneAndDelete({ _id: id, userId });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete ticket error:", error);
    res.status(500).json({
      message: error.message || "Failed to delete ticket",
    });
  }
};

// Get ticket statistics
export const getTicketStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const open = await Ticket.countDocuments({ userId, status: "Open" });
    const inProgress = await Ticket.countDocuments({ userId, status: "In Progress" });
    const resolved = await Ticket.countDocuments({ userId, status: "Resolved" });

    res.status(200).json({
      message: "Statistics retrieved successfully",
      stats: {
        open,
        inProgress,
        resolved,
        total: open + inProgress + resolved,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      message: error.message || "Failed to fetch statistics",
    });
  }
};
