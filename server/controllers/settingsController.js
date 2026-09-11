const supabase = require('../config/supabase');

const getPreferences = async (req, res) => {
    try {
        const { data: preferences, error } = await supabase
            .from('preferences')
            .select('*')
            .eq('user_id', req.user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        res.status(200).json({ preferences: preferences || {} });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching preferences', error: error.message });
    }
};

const updatePreferences = async (req, res) => {
    try {
        const { emailNotifications, smsNotifications, currency } = req.body;
        
        // Upsert preferences
        const { data: updatedPreferences, error } = await supabase
            .from('preferences')
            .upsert({
                user_id: req.user.id,
                email_notifications: emailNotifications,
                sms_notifications: smsNotifications,
                currency: currency
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: 'Preferences updated', preferences: updatedPreferences });
    } catch (error) {
        res.status(500).json({ message: 'Error updating preferences', error: error.message });
    }
};

module.exports = { getPreferences, updatePreferences };
