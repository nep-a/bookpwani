const getPreferences = async (req, res) => {
    try {
        // Mock DB fetch
        const preferences = {
            emailNotifications: true,
            smsNotifications: false,
            currency: 'USD'
        };

        res.status(200).json({ preferences });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching preferences', error: error.message });
    }
};

const updatePreferences = async (req, res) => {
    try {
        const { emailNotifications, smsNotifications, currency } = req.body;
        
        // Mock DB update
        const updatedPreferences = {
            emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
            smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
            currency: currency || 'USD'
        };

        res.status(200).json({ message: 'Preferences updated', preferences: updatedPreferences });
    } catch (error) {
        res.status(500).json({ message: 'Error updating preferences', error: error.message });
    }
};

module.exports = { getPreferences, updatePreferences };
