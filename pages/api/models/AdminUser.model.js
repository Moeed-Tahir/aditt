import mongoose from 'mongoose';

const AdminUserSchema = new mongoose.Schema({
  activeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  waitlistUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  activeUserLimit: { type: Number, default: 1000 }
});

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

export default AdminUser;