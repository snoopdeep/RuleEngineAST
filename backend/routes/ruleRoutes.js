// backend/routes/ruleRoutes.js
const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleController');

// Create a new rule
router.post('/rules', ruleController.createRule);

// Combine multiple rules
router.post('/rules/combine', ruleController.combineRules);

// Evaluate a rule
router.post('/rules/evaluate', ruleController.evaluateRule);

// Modify a rule
router.put('/rules/:rule_id', ruleController.modifyRule);

// Delete a rule
router.delete('/rules/:rule_id', ruleController.deleteRule);

// Get all rules
router.get('/rules', ruleController.getAllRules);

module.exports = router;
