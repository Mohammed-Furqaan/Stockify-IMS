import Supplier from "../models/Supplier.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, supplierId } =
      req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
      supplierId,
    });

    await newProduct.save();
    return res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding Product:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .populate("categoryId")
      .populate("supplierId");
    const suppliers = await Supplier.find({});
    const categories = await Category.find({});
    return res
      .status(200)
      .json({ success: true, products, suppliers, categories });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error in Suppliers" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, supplierId } =
      req.body;

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, categoryId, supplierId },
      { new: true }
    );

    if (!updateProduct) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updateProduct,
    });
  } catch (error) {
    console.error("Error updating Products: ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (existingProduct.isDeleted) {
      return res
        .status(400)
        .json({ success: true, message: "Product already deleted" });
    }

    await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting Product: ", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { getProducts, addProduct, updateProduct, deleteProduct };
