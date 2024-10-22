import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createRule, combineRules, evaluateRule } from '../src/utils/ruleParser.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ruleEngine', { useNewUrlParser: true, useUnifiedTopology: true });

const RuleSchema = new mongoose.Schema({
  name: String,
  ast: Object
});

const Rule = mongoose.model('Rule', RuleSchema);

app.post('/api/rules', async (req, res) => {
  try {
    const { name, ruleString } = req.body;
    const ast = createRule(ruleString);
    const rule = new Rule({ name, ast });
    await rule.save();
    res.json({ _id: rule._id, name: rule.name });
  } catch (error) {
    console.error('Error creating rule:', error);
    res.status(500).json({ error: 'Failed to create rule' });
  }
});

app.get('/api/rules', async (req, res) => {
  try {
    const rules = await Rule.find({}, '_id name');
    res.json(rules);
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

app.post('/api/evaluate', async (req, res) => {
  try {
    const { ruleIds, data } = req.body;
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    const combinedAst = combineRules(rules.map(rule => rule.ast));
    const result = evaluateRule(combinedAst, data);
    res.json({ result });
  } catch (error) {
    console.error('Error evaluating rules:', error);
    res.status(500).json({ error: 'Failed to evaluate rules' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));