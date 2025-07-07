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
  appliedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: Boolean,
    default: true
  },
  fullWavier: {
    type: Boolean,
    default: false,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });


const PromoCode = mongoose.models.PromoCode || mongoose.model('PromoCode', PromoCodeSchema);

export default PromoCode;
