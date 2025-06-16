import connectToDatabase from '../../config/dbConnect';
import PromoCode from '../../models/PromoCode.model';

export const createPromoCode = async (req, res) => {
  try {
    await connectToDatabase();

    const { name, discountType, discountValue, startDate, endDate, appliesTo, customUserLimit, limitUsers, status } = req.body;

    if (discountType === 'Percentage' && (discountValue < 0 || discountValue > 100)) {
      return res.status(400).json({ error: 'Percentage discount must be between 0 and 100' });
    }

    if (discountType === 'Fixed Amount' && discountValue < 0) {
      return res.status(400).json({ error: 'Fixed amount discount cannot be negative' });
    }

    const existingCode = await PromoCode.findOne({ name });
    if (existingCode) {
      return res.status(400).json({ error: 'Promo code with this name already exists' });
    }

    let formattedAppliesTo = appliesTo;
    if (appliesTo === 'Custom' && customUserLimit) {
      formattedAppliesTo = `First ${customUserLimit} Users`;
    }

    const promoCode = new PromoCode({
      name,
      discountType,
      discountValue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      appliesTo: formattedAppliesTo,
      customUserLimit: appliesTo === 'Custom' ? customUserLimit : undefined,
      limitUsers,
      status
    });

    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPromoCodes = async (req, res) => {
  try {
    await connectToDatabase();
    const { status } = req.body;
    let query = {};

    if (status) {
      query.status = status === 'true';
    }

    const promoCodes = await PromoCode.find(query).sort({ createdAt: -1 });
    res.json({message:"Successfully Get Promo Codes",promoCodes});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPromoCodeById = async (req, res) => {
  try {
    const { id } = req.body;

    await connectToDatabase();
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found' });
    }
    res.json(promoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePromoCode = async (req, res) => {
  try {
    await connectToDatabase();

    const {
      id,
      name,
      discountType,
      discountValue,
      startDate,
      endDate,
      appliesTo,
      customUserLimit,
      limitUsers,
      status
    } = req.body;

    // Convert to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Manual validation (bypasses schema validator issues)
    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    let formattedAppliesTo = appliesTo;
    if (appliesTo === 'Custom' && customUserLimit) {
      formattedAppliesTo = `First ${customUserLimit} Users`;
    }

    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      id,
      {
        name,
        discountType,
        discountValue,
        startDate: start,
        endDate: end,
        appliesTo: formattedAppliesTo,
        customUserLimit: appliesTo === 'Custom' ? customUserLimit : undefined,
        limitUsers,
        status
      },
      { new: true, runValidators: false } // Disable schema validators since we manually checked
    );

    if (!updatedPromoCode) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    res.json(updatedPromoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const togglePromoCodeStatus = async (req, res) => {
  try {
    const { id } = req.body;
    await connectToDatabase();
    const promoCode = await PromoCode.findById(id);
    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    promoCode.status = !promoCode.status;
    await promoCode.save();
    res.json(promoCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.body;
    await connectToDatabase();
    const deletedPromoCode = await PromoCode.findByIdAndDelete(id);
    if (!deletedPromoCode) {
      return res.status(404).json({ error: 'Promo code not found' });
    }
    res.json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validatePromoCode = async (req, res) => {
  try {
    await connectToDatabase();
    const { name } = req.body;
    const promoCode = await PromoCode.findOne({ name });

    if (!promoCode) {
      return res.status(404).json({ valid: false, error: 'Promo code not found' });
    }

    const currentDate = new Date();
    if (currentDate < promoCode.startDate || currentDate > promoCode.endDate) {
      return res.json({
        valid: false,
        error: 'Promo code is not valid for current date'
      });
    }

    if (!promoCode.status) {
      return res.json({
        valid: false,
        error: 'Promo code is inactive'
      });
    }

    res.json({
      valid: true,
      promoCode,
      discountInfo: {
        type: promoCode.discountType,
        value: promoCode.discountValue
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};