import asyncHandler from "express-async-handler";

import Order from '../models/orderModel.js';


//@desc Create new order
//@route POST/api/orders
//@access Private
const addOrderItems = asyncHandler(async(req,res) =>{
    const {
        addOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shappingPrice,
        totalPrice,
    } = req.body
  
        if (addOrderItems && addOrderItems.length === 0 ) {
            res.status(400)
            throw new Error ('No order items')
            reture 
        }else {
            const order = new Order ({
                addOrderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shappingPrice,
                totalPrice,
            })

            const createdOrder = await order.save()

            res.status(201).json(createdOrder)
        }
}) 


//@desc get order by ID
//@route get/api/orders/:id
//@access Private
const getOrderById = asyncHandler(async(req,res) =>{
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    

    if (order) {
        res.json(order)
    }else {
        res.status(404)
        throw new Error('Order not found')
    }
}) 
 

//@desc get order to Paid with paypal
//@route get/api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async(req,res) =>{
    const order = await Order.findById(req.params.id)
    

    if (order) {
        order.isPaid = true
        order.paidAt = Date
        order.paymentResult = {
             id:req.body.id,
             status:req.body.status,
             update_time: req.body.payer.email_address 
        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    }else {
        res.status(404)
        throw new Error('Order not found')
    }
}) 
 


//@desc get order to delivered
//@route get/api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDelivered  = asyncHandler(async(req,res) =>{
    const order = await Order.findById(req.params.id)
    

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date
       
         
        const updatedOrder = await order.save()
        res.json(upatedOrder);
    }else {
        res.status(404)
        throw new Error('Order not found')
    }
}) 
 


//@desc get logged in user order
//@route get/api/orders/myorder
//@access Private
const getMyOrders = asyncHandler(async(req,res) =>{
    const orders = await Order.find({user: req.user._id})
    res,json(orders)

    
}) 
 
//@desc Get all orders
//@route get/api/orders
//@access Private/Admin
const getOrders = asyncHandler(async(req,res) =>{
    const orders = await Order.find({}).populate('user. id name')

    res,json(orders)

    
}) 

export {
    addOrderItems, getOrderById , updateOrderToPaid, getMyOrders,getOrders, updateOrderToDelivered   
}