
const express = require('express');
const BorrowDB = require('../orderDB/borrowsDB');
const router = express.Router();


router.get('/borrows', async (req, res) => {
    try {
        const result = await BorrowDB.getAllBorrows();

        if (result.success) {
            res.json({
                collection: 'borrows',
                count: result.count,
                data: result.data
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve borrow data',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

router.put('/borrows/:id', async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const result = await BorrowDB.updateBorrow(id, {
            status: status,
        });
        try{
        if (result.success) {
            res.json({
                message: 'borrow updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({
                error: 'Failed to update borrow',
                message: result.error
            });
        }
        } catch (error) {
            res.status(500).json({
                error: 'Server error',
                message: error.message
            });
        }
});

router.post("/borrows", async (req, res) => {
    try {
        const { borrowsArray } = req.body;
        
        if (!borrowsArray || !Array.isArray(borrowsArray) || borrowsArray.length === 0) {
            return res.status(400).json({
                success: false,
                error: "borrows array is required and must not be empty"
            });
        }

        const results = [];
        
        
        for (const borrowData of borrowsArray) {
            const result = await BorrowDB.insertBorrow(borrowData); 
            if (result.success) {
                results.push(result.data);
            } else {
                
                return res.status(500).json(result);
            }
        }
        
        res.status(201).json({
            success: true,
            message: `succesful ${results.length} `,
            data: results
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/borrows/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await BorrowDB.deleteBorrow(id);

        if (result.success) {
            res.json({
                message: 'Borrow deleted successfully',
                data: result.data
            });
        } else {
            res.status(400).json({
                error: 'Failed to delete borrow',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;