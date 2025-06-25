import LoadCell from '../model/LoadCell';

// GET all
export const getAllLoadCells = async (req, res) => {
    try {
        const data = await LoadCell.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            error: 'Server error'
        });
    }
};

// POST create
export const createLoadCell = async (req, res) => {
    try {
        const loadCell = new LoadCell(req.body);
        const saved = await loadCell.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({
            error: 'Invalid data'
        });
    }
};

// PUT update
export const updateLoadCell = async (req, res) => {
    try {
        const updated = await LoadCell.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({
            error: 'Update failed'
        });
    }
};

// DELETE
export const deleteLoadCell = async (req, res) => {
    try {
        await LoadCell.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Deleted successfully'
        });
    } catch (err) {
        res.status(400).json({
            error: 'Delete failed'
        });
    }
};