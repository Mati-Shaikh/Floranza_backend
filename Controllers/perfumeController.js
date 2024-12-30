// controllers/perfumeController.js
const Perfume = require("../models/Perfume");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Create Perfume
let createPerfume = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
    
        if (!req.file) {
          return res.status(400).json({ message: "Image file is required" });
        }
    
        const newPerfume = new Perfume({
          name,
          description,
          price,
          stock,
          image: req.file.path, // Save the correct file path
        });
    
        await newPerfume.save();
        res.status(201).json(newPerfume);
      } catch (error) {
        console.error("Error creating perfume:", error.message);
        res.status(500).json({ message: "Server error while creating perfume" });
      }
};

// Get All Perfumes
let getPerfumes = async (req, res) => {
    try {
        const perfumes = await Perfume.find();
        res.status(200).json(perfumes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch perfumes", error });
    }
};

// Update Perfume
let updatePerfume = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;

        const perfume = await Perfume.findById(id);
        if (!perfume) return res.status(404).json({ message: "Perfume not found" });

        if (req.file) {
            if (perfume.image) fs.unlinkSync(path.resolve(perfume.image));
            perfume.image = req.file.path;
        }

        perfume.name = name || perfume.name;
        perfume.description = description || perfume.description;
        perfume.price = price || perfume.price;
        perfume.stock = stock || perfume.stock;

        await perfume.save();

        res.status(200).json({ message: "Perfume updated successfully", perfume });
    } catch (error) {
        res.status(500).json({ message: "Failed to update perfume", error });
    }
};

// Delete Perfume
let deletePerfume = async (req, res) => {
    try {
        const { id } = req.params;
        const perfume = await Perfume.findById(id);

        if (!perfume) return res.status(404).json({ message: "Perfume not found" });

        const imagePath = path.resolve(perfume.image);
        console.log('Deleting file at path:', imagePath);

        // Check if the file exists before trying to delete it
        if (perfume.image && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        } else {
            console.log('Image not found or already deleted');
        }

        // Use deleteOne instead of remove
        await perfume.deleteOne();  // Deletes the document from the database

        res.status(200).json({ message: "Perfume deleted successfully" });
    } catch (error) {
        console.error(error);  // Log the error to the console
        res.status(500).json({ message: "Failed to delete perfume", error: error.message });
    }
};


// Create Order
let createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, perfumeId, paymentStatus } = req.body;

        const order = new Order({ customerName, customerEmail, perfumeId, paymentStatus });
        await order.save();

        res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error });
    }
};

// Get All Orders
let getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("perfumeId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};

// Update Admin Password
let updateAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        console.log(req.adminPassword);

        if (req.adminPassword !== currentPassword)
            return res.status(401).json({ message: "Incorrect current password" });

        req.adminPassword = newPassword;
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update password", error });
    }
};
module.exports = {createPerfume, getPerfumes, updatePerfume, deletePerfume, createOrder, updateAdminPassword, getOrders};