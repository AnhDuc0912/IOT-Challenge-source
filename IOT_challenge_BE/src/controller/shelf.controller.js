const Shelf = require("../model/Shelf");
const LoadCell = require("../model/LoadCell");

// Lấy danh sách tất cả kệ
exports.getAllShelves = async (req, res) => {
  try {
    const shelves = await Shelf.find().populate("user_id", "username role");
    res.json(shelves);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch shelves",
    });
  }
};

// Tạo mới kệ
exports.createShelf = async (req, res) => {
  try {
    // Check trùng shelf_id
    const existing = await Shelf.findOne({
      shelf_id: req.body.shelf_id,
    });
    if (existing) {
      return res.status(400).json({
        error: "Shelf already exists",
        message: `Shelf ID ${req.body.shelf_id} already exists.`,
      });
    }

    // Tạo shelf mới
    const shelf = new Shelf(req.body);
    await shelf.save();

    // Tạo 15 LoadCell tương ứng
    const loadCells = [];
    const totalFloors = 3;
    const totalColumns = 5;
    let loadCellCounter = 1;

    for (let floor = 1; floor <= totalFloors; floor++) {
      for (let column = 1; column <= totalColumns; column++) {
        loadCells.push({
          load_cell_id: loadCellCounter++,
          load_cell_name: `LC-${floor}-${column}`,
          product_id: "",
          shelf_id: shelf._id, // dùng ObjectId nếu LoadCell schema dùng ObjectId
          quantity: 0,
          floor,
          column,
        });
      }
    }

    await LoadCell.insertMany(loadCells);

    res.status(201).json({
      shelf,
      message: "Shelf and 15 load cells created successfully.",
    });
  } catch (err) {
    res.status(400).json({
      error: "Failed to create shelf or load cells",
      message: err.message,
    });
  }
};

// Lấy danh sách LoadCell theo Shelf ID
exports.getLoadsellByShelfId = async (req, res) => {
  try {
    const shelfId = req.params.shelfId;

    const shelf = await Shelf.findById(shelfId);
    if (!shelf) {
      return res.status(404).json({
        error: "Shelf not found",
        message: `Shelf with ID ${shelfId} does not exist.`,
      });
    }

    // Lấy tất cả trường và populate product_id
    const loadCells = await LoadCell.find({
        shelf_id: shelfId
      })
      .select("_id load_cell_id load_cell_name product_id previous_product_id product_name shelf_id quantity floor column threshold error")
      .lean();

    if (!loadCells || loadCells.length === 0) {
      return res.status(404).json({
        error: "No load cells found",
        message: `No load cells found for shelf ID ${shelfId}.`,
      });
    }

    res.status(200).json({
      shelf: {
        shelf_id: shelf.shelf_id,
        _id: shelf._id,
      },
      loadCells,
      message: "Load cells retrieved successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch load cells",
      message: err.message,
    });
  }
};
// Cập nhật kệ
exports.updateShelf = async (req, res) => {
  try {
    const shelf = await Shelf.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!shelf)
      return res.status(404).json({
        error: "Shelf not found",
      });
    res.json(shelf);
  } catch (err) {
    res.status(400).json({
      error: "Failed to update shelf",
    });
  }
};

// Xóa kệ
exports.deleteShelf = async (req, res) => {
  try {
    await Shelf.findByIdAndDelete(req.params.id);
    res.json({
      message: "Shelf deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete shelf",
    });
  }
};

// Lấy danh sách sản phẩm trên load cell theo Shelf ID
exports.getProductsByShelfId = async (req, res) => {
  try {
    const shelfId = req.params.shelfId;

    // Kiểm tra xem kệ có tồn tại không
    const shelf = await Shelf.findById(shelfId);
    if (!shelf) {
      return res.status(404).json({
        error: "Shelf not found",
        message: `Shelf with ID ${shelfId} does not exist.`,
      });
    }

    // Lấy danh sách sản phẩm từ load cells với populate và sắp xếp
    const loadCells = await LoadCell.find({ shelf_id: shelfId })
      .select("product_id quantity floor column")
      .populate({
        path: "product_id",
        select: "product_name price weight img_url",
        model: "Product" // Tên model của Product
      })
      .sort({ floor: 1, column: 1 }) // Sắp xếp theo floor tăng dần, sau đó column tăng dần
      .lean();

    // Lọc các load cell có sản phẩm (product_id không null hoặc rỗng)
    const products = loadCells
      .filter((cell) => cell.product_id)
      .map((cell) => ({
        product_id: cell.product_id._id,
        product_name: cell.product_id.product_name,
        price: cell.product_id.price,
        weight: cell.product_id.weight,
        img_url: cell.product_id.img_url,
      }));

    res.status(200).json({
      shelf: {
        shelf_id: shelf.shelf_id,
        _id: shelf._id,
      },
      products,
      message: "Products retrieved successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch products",
      message: err.message,
    });
  }
};