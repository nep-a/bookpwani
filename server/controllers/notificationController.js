const supabase = require('../config/supabase');

const getNotifications = async (req, res) => {
    try {
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { data: updatedNotif, error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: \Notification \ marked as read\, notification: updatedNotif });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};

module.exports = { getNotifications, markAsRead };
