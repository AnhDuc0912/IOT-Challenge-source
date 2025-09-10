// src/controller/oder.controller.js
const Oder = require('../model/Oder');
const OderDetail = require('../model/OderDetail');
const fs = require("fs");
const path = require("path");

// Tạo mới Order cùng details (transaction)
exports.createOrderWithDetails = async (req, res) => {
    const session = await Oder.startSession();
    try {
        await session.startTransaction();

        // 1) Parse body cho cả JSON lẫn multipart
        const body = req.body || {};

        // ép kiểu số cho tổng bill
        const total_bill =
            body.total_bill !== undefined && body.total_bill !== null ?
            Number(body.total_bill) :
            undefined;

        // parse orderDetails nếu là string (multipart)
        let orderDetailsField = body.orderDetails;
        if (typeof orderDetailsField === "string") {
            try {
                orderDetailsField = JSON.parse(orderDetailsField);
            } catch {
                orderDetailsField = [];
            }
        }
        const orderDetails = Array.isArray(orderDetailsField) ?
            orderDetailsField :
            (orderDetailsField ? [orderDetailsField] : []);

        // 2) Chuẩn hóa orderData đúng schema
        const orderData = {
            status: body.status,
            order_code: body.order_code,
            shelf_id: body.shelf_id,
            total_bill: total_bill
        };

        // Validate tối thiểu
        if (!orderData.order_code || !orderData.shelf_id || !Number.isFinite(orderData.total_bill)) {
            return res.status(400).json({
                error: "order_code/shelf_id/total_bill is required"
            });
        }

        // 3) Tạo Order
        const order = await new Oder(orderData).save({
            session
        });

        // 4) Tạo OrderDetails (ép kiểu số cho quantity/price/total_price)
        const details = await Promise.all(
            (orderDetails || []).map((d) => {
                const payload = {
                    ...d,
                    order_id: order._id,
                    quantity: d.quantity != null ? Number(d.quantity) : undefined,
                    price: d.price != null ? Number(d.price) : undefined,
                    total_price: d.total_price != null ? Number(d.total_price) : undefined,
                };
                return new OderDetail(payload).save({
                    session
                });
            })
        );

        // 5) Commit trước khi xử lý file (tránh lỗi file làm hỏng transaction)
        await session.commitTransaction();

        // 6) Save ảnh (nếu có). Không ràng buộc transaction.
        try {
            const uploadDir = path.join(__dirname, "..", "..", "uploads", "customers");
            fs.mkdirSync(uploadDir, {
                recursive: true
            });

            // multer.single('receipt_image') => req.file
            // trước khi lưu ảnh:
            let file = req.file;
            if (!file && req.files) {
                file =
                    (req.files.receipt_image && req.files.receipt_image[0]) ||
                    (req.files.customer_image && req.files.customer_image[0]) ||
                    (req.files.file && req.files.file[0]);
            }

            if (file) {
                const originalName = file.originalname || file.name || "";
                const ext = path.extname(originalName || "") || ".jpg";
                const destName = `${order._id.toString()}-${Date.now()}${ext}`;
                const destPath = path.join(uploadDir, destName);

                if (file.path) {
                    fs.renameSync(file.path, destPath);
                } else if (file.buffer) {
                    fs.writeFileSync(destPath, file.buffer);
                }

                const publicPath = `/uploads/customers/${destName}`;
                await Oder.findByIdAndUpdate(order._id, {
                    $set: {
                        customer_image: publicPath
                    }
                });
                order.customer_image = publicPath;
            } else if (req.body.customer_image) {
                const url = String(req.body.customer_image);
                await Oder.findByIdAndUpdate(order._id, {
                    $set: {
                        customer_image: url
                    }
                });
                order.customer_image = url;
            }
        } catch (fileErr) {
            console.error("Customer image save error:", fileErr);
            // không fail response
        }

        // 7) Trả về (dùng toObject để loại metadata mongoose)
        return res.status(201).json({
            order: order.toObject ? order.toObject() : order,
            orderDetails: details.map(d => (d.toObject ? d.toObject() : d)),
        });
    } catch (err) {
        console.error(err);
        try {
            await session.abortTransaction();
        } catch {}
        return res.status(400).json({
            error: err.message
        });
    } finally {
        session.endSession();
    }
};

// Lấy danh sách Order (kèm OrderDetail)
exports.getOrders = async (req, res) => {
    try {
        const orders = await Oder.find().sort({
            createdAt: -1
        });

        const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
                const details = await OderDetail.find({
                        order_id: order._id
                    })
                    .populate({
                        path: 'product_id',
                        model: 'Product'
                    })
                    .populate({
                        path: 'order_id',
                        model: 'Oder'
                    });
                return {
                    ...order,
                    details
                };
            })
        );

        res.status(200).json({
            success: true,
            data: ordersWithDetails
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders',
            message: err.message
        });
    }
};

// Get order detail by ID
exports.getOrderDetail = async (req, res) => {
    console.log(req.params.id)
    try {
        const orderId = req.params.id;
        const order = await Oder.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        const orderDetails = await OderDetail.find({
                order_id: orderId
            })
            .populate({
                path: 'product_id',
                model: 'Product'
            }) // populate product info
            .populate({
                path: 'order_id',
                model: 'Oder'
            }); // populate order info on each detail

        res.status(200).json({
            success: true,
            data: {
                order,
                details: orderDetails
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order detail',
            message: err.message
        });
    }
};