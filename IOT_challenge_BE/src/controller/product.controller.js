const Product = require('../model/Product');

exports.createProduct = async (req, res) => {

  console.log(req.file);

  try {
    const {
      product_id,
      product_name,
      price,
      stock
    } = req.body;
    const img_url = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      product_id,
      product_name,
      img_url,
      price,
      stock
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({
      error: 'Product not found'
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };
    if (req.file) {
      updateData.img_url = `${process.env.APP_ADDRESS}/uploads/${req.file.filename}`;
    }

    console.log(updateData);
    

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product)
      return res.status(404).json({
        error: "Product not found",
      });
    res.json(product);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({
      error: 'Product not found'
    });
    res.json({
      message: 'Product deleted'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};