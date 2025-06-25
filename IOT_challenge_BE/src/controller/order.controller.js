// src/controller/oder.controller.js
const Oder = require('../model/Oder');
const OderDetail = require('../model/OderDetail');

// Tạo mới Order
exports.createOrderWithDetails = async (req, res) => {
    const session = await Oder.startSession();
    session.startTransaction();

    try {
        const {
            orderDetails,
            ...orderData
        } = req.body;

        // 1. Tạo Order
        const order = new Oder(orderData);
        await order.save({
            session
        });

        // 2. Tạo các OrderDetail
        const details = await Promise.all(
            orderDetails.map(detail => {
                return new OderDetail({
                    ...detail,
                    order_id: order._id // gắn id từ order vừa tạo
                }).save({
                    session
                });
            })
        );

        // 3. Commit
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            order,
            orderDetails: details
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({
            error: err.message
        });
    }
};


// Lấy danh sách Order
exports.getOrders = async (req, res) => {
    try {
        const orders = await Oder.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};