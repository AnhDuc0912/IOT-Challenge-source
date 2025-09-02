const Product = require("../model/Product");
const { pickUploadedFile, buildFileUrl } = require("../utils/upload.helper");

exports.createProduct = async (req, res) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("req.body keys:", Object.keys(req.body || {}));
  console.log("req.files:", req.files);
  console.log("req.file:", req.file);

  try {
    const file = pickUploadedFile(req);
    console.log("picked file:", file);

    const {
      product_id,
      product_name,
      price,
      stock,
      img_url: bodyImgUrl,
    } = req.body;

    const img_url = file
      ? buildFileUrl(file)
      : (bodyImgUrl && String(bodyImgUrl).trim() ? String(bodyImgUrl).trim() : "/uploads/default.png");

    const product = new Product({
      product_id,
      product_name,
      img_url,
      price,
      stock,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
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
    const updateData = { ...req.body };
    const file = pickUploadedFile(req);
    if (file) updateData.img_url = buildFileUrl(file);
    else if (Object.prototype.hasOwnProperty.call(req.body, "img_url")) {
      const b = String(req.body.img_url || "").trim();
      updateData.img_url = b ? b : "/uploads/default.png";
    }

    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    console.log("updateData:", updateData);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
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