import mongoose from 'mongoose';
import ProductionTask from './src/models/production/ProductionTask.js';
mongoose.connect('mongodb+srv://ryphira:ryphira@cluster0.vhnowt2.mongodb.net/InteriorSoftware?appName=Cluster0').then(async () => {
  const task = await ProductionTask.findOne({ title: 'qwertyuiop' }).lean();
  console.log(JSON.stringify(task, null, 2));
  process.exit();
});
