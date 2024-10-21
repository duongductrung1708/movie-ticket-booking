const PaymentMethod = require("../models/PaymentMethod");

// Tạo mới phương thức thanh toán
const createPaymentMethod = async (req, res) => {
    const { name, description, fee } = req.body;
    
    try {
        const paymentMethod = new PaymentMethod({ name, description, fee });
        const savedPaymentMethod = await paymentMethod.save();
        res.status(201).json(savedPaymentMethod);
    } catch (error) {
        res.status(400).json({ message: 'Error creating Payment Method', error });
    }
};


const getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.find();
        res.status(200).json(paymentMethods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Payment Methods', error });
    }
};

// Lấy phương thức thanh toán theo ID
const getPaymentMethodById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const paymentMethod = await PaymentMethod.findById(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment Method not found' });
        }
        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Payment Method', error });
    }
};

// Cập nhật phương thức thanh toán
const updatePaymentMethod = async (req, res) => {
    const { id } = req.params;
    const { name, description, fee } = req.body;
    
    try {
        const paymentMethod = await PaymentMethod.findByIdAndUpdate(id, { name, description, fee }, { new: true, runValidators: true });
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment Method not found' });
        }
        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(400).json({ message: 'Error updating Payment Method', error });
    }
};

// Xóa phương thức thanh toán
const deletePaymentMethod = async (req, res) => {
    const { id } = req.params;
    
    try {
        const paymentMethod = await PaymentMethod.findByIdAndDelete(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment Method not found' });
        }
        res.status(200).json({ message: 'Payment Method deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Payment Method', error });
    }
};

module.exports = {
    createPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod,
};
