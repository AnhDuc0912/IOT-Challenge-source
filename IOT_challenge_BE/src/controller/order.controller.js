// src/controller/oder.controller.js
const Oder = require('../model/Oder');
const OderDetail = require('../model/OderDetail');

// Tạo mới Order cùng details (transaction)
exports.createOrderWithDetails = async (req, res) => {
    const session = await Oder.startSession();
    session.startTransaction();

    try {
        const {
            orderDetails,
            ...orderData
        } = req.body;

        const order = new Oder(orderData);
        await order.save({
            session
        });

        const details = await Promise.all(
            orderDetails.map(detail =>
                new OderDetail({
                    ...detail,
                    order_id: order._id,
                }).save({
                    session
                })
            )
        );

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