import connectToDatabase from '../../config/dbConnect';
import UserChatSupport  from '../../models/UserChatSupport.model';

const addChatSupport = async (req, res) => {
    try {
        await connectToDatabase();
        
        const { userId,queryTitle, queryDetail } = req.body;

        if (!queryTitle || !queryDetail || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Both queryTitle and queryDetail are required'
            });
        }

        const newChatSupport = new UserChatSupport({
            queryTitle,
            queryDetail,
            userId
        });

        await newChatSupport.save();

        return res.status(200).json({
            success: true,
            message: 'Chat support query created successfully',
            data: newChatSupport
        });

    } catch (error) {
        console.error('Error creating chat support:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry detected. Please try again.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


module.exports = { addChatSupport };