const mongoose = require('mongoose');

async function run() {
    await mongoose.connect('mongodb://localhost:27017/interior');
    
    // List some users
    const User = mongoose.model('User', new mongoose.Schema({
        fullName: String,
        email: String,
        role: String
    }));
    
    const users = await User.find({});
    console.log('--- USERS ---');
    users.forEach(u => console.log(`${u._id}: ${u.fullName} (${u.role}) - ${u.email}`));

    // List site reports
    try {
        const SiteProgressReport = mongoose.model('SiteProgressReport', new mongoose.Schema({
            project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
            date: Date,
            submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            sendToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            workStatus: String,
            workDone: String
        }));
        
        const reports = await SiteProgressReport.find({});
        console.log('--- SITE PROGRESS REPORTS ---');
        reports.forEach(r => console.log(`${r._id}: from=${r.submittedBy} to=${r.sendToUser} status=${r.workStatus} done=${r.workDone}`));
    } catch (e) {
        console.log('Error listing reports:', e);
    }
    
    await mongoose.disconnect();
}

run();
