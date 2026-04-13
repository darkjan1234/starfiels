const express = require('express');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Documents routes - placeholder
const uploadDocument = async (req, res) => {
  res.json({ message: 'Upload document' });
};

const getDocuments = async (req, res) => {
  res.json({ message: 'Get documents', documents: [] });
};

const downloadDocument = async (req, res) => {
  res.json({ message: 'Download document' });
};

const deleteDocument = async (req, res) => {
  res.json({ message: 'Delete document' });
};

router.post('/upload', authenticate, upload.single('document'), uploadDocument);
router.get('/', authenticate, getDocuments);
router.get('/:id/download', authenticate, downloadDocument);
router.delete('/:id', authenticate, deleteDocument);

module.exports = router;
