const getNotifications = async (req, res) => {
    try {
        // Mock DB fetch
        const notifications = [
            { id: 'notif_1', message: 'Welcome to VisitTour!', read: false },
            { id: 'notif_2', message: 'Your event booking is confirmed.', read: true }
        ];

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        // Mock DB update
        res.status(200).json({ message: `Notification ${id} marked as read` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};

module.exports = { getNotifications, markAsRead };
