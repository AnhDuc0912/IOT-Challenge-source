const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Combo = require("../model/Combo");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

function buildFileUrl(file) {
  if (!file) return "";
  const host = process.env.APP_ADDRESS?.replace(/\/$/, "") || "";
  // Nếu bạn phục vụ static /public/uploads, có thể đổi thành `/uploads/${file.filename}`
  return `uploads/${file.filename}`;
}

/** Lấy file upload từ cả 2 trường hợp:
 * - .single("product_image")  => req.file
 * - .fields([{name:"image"},{name:"product_image"}]) => req.files.image[0] / req.files.product_image[0]
 */
function pickFirstFile(req) {
  if (req.file) return req.file; // trường hợp .single("product_image")

  // Trường hợp .fields(...)
  if (req.files?.image?.[0]) return req.files.image[0];
  if (req.files?.product_image?.[0]) return req.files.product_image[0];

  return null;
}

function parseProductsField(productsField) {
  if (!productsField) return [];
  if (Array.isArray(productsField)) return productsField;
  // try JSON array
  try {
    const parsed = JSON.parse(productsField);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) { /* ignore */ }
  // fallback: comma/space separated
  return String(productsField).split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
}

exports.createCombo = async (req, res) => {
  // log which expected fields are missing/undefined
  const expected = [
    "name",
    "description",
    "current_price",
    "original_price",
    "price",
    "oldPrice",
    "validFrom",
    "validTo",
    "products",
    "image",
  ];
  const undefinedFields = expected.filter((k) => req.body[k] === undefined);
  console.log("undefined fields in req.body:", undefinedFields);

  try {
    const {
      name,
      description,
      current_price,
      original_price,
      price,
      oldPrice,
      validFrom,
      validTo,
    } = req.body;

    const cp = current_price ?? price;
    const op = original_price ?? oldPrice;

    if (!name || cp == null) {
      return res
        .status(400)
        .json({ success: false, message: "name và current_price là bắt buộc" });
    }

    const productsRaw = parseProductsField(req.body.products);
    console.log("parsed productsRaw:", productsRaw);
    const products = productsRaw.filter(isValidObjectId);
    console.log("filtered product ids (valid ObjectId):", products);

    const file = pickFirstFile(req);

    const combo = new Combo({
      name,
      description,
      image: file ? buildFileUrl(file) : (req.body.image || ""),
      current_price: Number(cp),
      original_price: op != null ? Number(op) : undefined,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validTo: validTo ? new Date(validTo) : undefined,
      products,
    });

    await combo.save();
    const saved = await Combo.findById(combo._id).populate("products");
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.getCombos = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "20", 10));
    const search = (req.query.search || "").trim();

    const filter = {};
    if (search) {
      if (Combo.schema.indexes().some(([idx]) => idx && idx.name === "text")) {
        filter.$text = { $search: search };
      } else {
        filter.name = { $regex: search, $options: "i" };
      }
    }

    const total = await Combo.countDocuments(filter);
    const combos = await Combo.find(filter)
      .populate("products")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ success: true, data: combos, meta: { total, page, limit } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.getComboById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ success: false, message: "Id không hợp lệ" });

    const combo = await Combo.findById(id).populate("products");
    if (!combo) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });

    res.json({ success: true, data: combo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.updateCombo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ success: false, message: "Id không hợp lệ" });

    const body = { ...req.body };
    if (body.price !== undefined && body.current_price === undefined) body.current_price = body.price;
    if (body.oldPrice !== undefined && body.original_price === undefined) body.original_price = body.oldPrice;

    const update = {};
    const upFields = [
      "name",
      "description",
      "current_price",
      "original_price",
      "validFrom",
      "validTo",
      "products",
      "active",
    ];
    upFields.forEach((f) => {
      if (body[f] !== undefined) update[f] = body[f];
    });

    const file = pickFirstFile(req);

    // if file uploaded, set image url; else respect incoming string image
    if (file) {
      update.image = buildFileUrl(file);
    } else if (body.image !== undefined) {
      update.image = body.image;
    }

    if (update.validFrom) update.validFrom = new Date(update.validFrom);
    if (update.validTo) update.validTo = new Date(update.validTo);

    if (update.products) {
      const productsRaw = Array.isArray(update.products) ? update.products : parseProductsField(update.products);
      update.products = productsRaw.filter(isValidObjectId);
    }

    if (update.current_price !== undefined) update.current_price = Number(update.current_price);
    if (update.original_price !== undefined) update.original_price = Number(update.original_price);

    const updated = await Combo.findByIdAndUpdate(id, update, { new: true }).populate("products");
    if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ success: false, message: "Id không hợp lệ" });

    const removed = await Combo.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ success: false, message: "Không tìm thấy combo" });

    // optional: remove uploaded image file from disk if exists
    if (removed.image) {
      try {
        const uploadsDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
        const filename = path.basename(removed.image);
        const filePath = path.join(uploadsDir, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.warn("Không thể xóa file ảnh (không bắt buộc):", e.message);
      }
    }

    res.json({ success: true, message: "Đã xóa combo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
