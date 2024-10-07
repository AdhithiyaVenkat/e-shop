const Category = require('../models/Category');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find();

    // If no categories found, return an empty array
    if (!categories.length) {
      return res.json([]);
    }

    // For each category, calculate stock_available and total_sales_amount
    const categoriesSummary = await Promise.all(categories.map(async (category) => {
      // Fetch all products for this category
      const products = await Product.find({ category: category._id });
      
      // Calculate stock available
      const stockAvailable = products.reduce((sum, product) => sum + product.stock, 0);

      // Aggregate total sales amount from the orders table for this category's products
      const productIds = products.map(product => product._id);
      const totalSalesAmount = await Order.aggregate([
        { $match: { product_id: { $in: productIds } } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: { $multiply: ['$quantity', '$price'] } }
          }
        }
      ]);

      return {
        ...category._doc,
        stock_available: stockAvailable,
        total_sales_amount: totalSalesAmount[0]?.totalSales || 0,
      };
    }));

    // Return the list of categories with their stock and sales information
    res.json(categoriesSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;  // Assuming req.user contains the logged-in user's info
  
    try {
      // Check if the category already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
  
      // Create a new category with the associated user
      const newCategory = new Category({
        name,
        description,
        created_by: userId,  // Associate the category with the user who created it
      });
  
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
    }
  };

// Update a category by ID
exports.updateCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    // Delete all products in this category
    await Product.deleteMany({ category: req.params.id });

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
