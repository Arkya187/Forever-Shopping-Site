import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

const currency = 'inr'
const deliveryCharge = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


//Placing Orders using COD method
const placeOrder = async(req,res) =>{
    try {
        const {userId, items, amount, address} = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}});

        res.json({success:true, message: "Order Placed!!"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//Placing Orders using Stripe method
const placeOrderStripe = async(req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));
        line_items.push({
            price_data: {
                currency: currency,
                product_data: { name: "Delivery Charges" },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const metadata = {
            userId,
            amount: amount.toString(),
            address: JSON.stringify(address),
            items: JSON.stringify(items)
        };

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/verify?success=false`,
            line_items,
            mode: 'payment',
            metadata
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//Verify Stripe
const verifyStripe = async(req,res) =>{
    const { session_id, success } = req.body;
    try {
        if (!success) return res.json({ success: false });

        const session = await stripe.checkout.sessions.retrieve(session_id);
        const metadata = session.metadata;

        const userId = metadata.userId;
        const address = JSON.parse(metadata.address);
        const items = JSON.parse(metadata.items);
        const amount = parseFloat(metadata.amount);

        const newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: true,
            date: Date.now()
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//Placing Orders using Razorpay method
const placeOrderRazorpay = async(req,res) =>{

}

//All Orders data for admin panel
const allOrders = async(req,res) =>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//User order data for frontend
const userOrders = async(req,res) =>{
    try {
        const {userId} = req.body;
        const orders = await orderModel.find({userId})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//update order status from admin Panel
const updateStatus = async(req,res) =>{
    try {
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, message: 'Status Updated'})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus,verifyStripe} 