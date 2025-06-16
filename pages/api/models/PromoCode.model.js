import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['Percentage', 'Fixed Amount'],
    default: 'Percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  appliesTo: {
    type: String,
    required: true,
    enum: ['New Signup', 'First 50 Users', 'First 100 Users', 'Custom'],
    default: 'New Signup'
  },
  customUserLimit: {
    type: Number,
    min: 1,
    required: function () {
      return this.appliesTo === 'Custom';
    }
  },
  limitUsers: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

PromoCodeSchema.index({ name: 1 });
PromoCodeSchema.index({ status: 1 });
PromoCodeSchema.index({ startDate: 1, endDate: 1 });

PromoCodeSchema.pre('save', function (next) {
  if (this.appliesTo === 'Custom' && this.customUserLimit) {
    this.appliesTo = `First ${this.customUserLimit} Users`;
  }
  next();
});

const PromoCode = mongoose.models.PromoCode || mongoose.model('PromoCode', PromoCodeSchema);

export default PromoCode;