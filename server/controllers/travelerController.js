const supabase = require('../config/supabase');

const updateProfile = async (req, res) => {
    try {
        const { name, phoneNumber, bio } = req.body;
        const profilePic = req.file ? req.file.path : null;

        const updateData = {};
        if (name) updateData.username = name;
        if (phoneNumber) updateData.phone_number = phoneNumber;
        // bio could be added if needed, but schema doesn't have it
        if (profilePic) updateData.profile_pic = profilePic;

        const { data: updatedTraveler, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        delete updatedTraveler.password;
        res.status(200).json({ message: 'Traveler profile updated successfully', traveler: updatedTraveler });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const bookEvent = async (req, res) => {
    try {
        const { eventId, ticketsCount, ticketTierName, totalPrice } = req.body;

        const ticketCode = 'BPW-' + Math.random().toString(36).substring(2, 10).toUpperCase();

        const { data: newBooking, error } = await supabase
            .from('bookings')
            .insert([{
                traveler_id: req.user.id,
                event_id: eventId,
                tickets_count: ticketsCount,
                ticket_tier_name: ticketTierName,
                total_price: totalPrice,
                ticket_code: ticketCode,
                status: 'confirmed',
                is_downloaded: false
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: 'Event booked successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error booking event', error: error.message });
    }
};

const getBookings = async (req, res) => {
    try {
        // First delete expired events to satisfy requirement
        // We delete tickets based on past events
        const { data: expiredEvents } = await supabase
            .from('events')
            .select('id')
            .lt('date', new Date().toISOString().split('T')[0]); // Events where date is before today

        if (expiredEvents && expiredEvents.length > 0) {
            const expiredIds = expiredEvents.map(e => e.id);
            await supabase
                .from('bookings')
                .delete()
                .in('event_id', expiredIds);
        }

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, event:events(*)')
            .eq('traveler_id', req.user.id);

        if (error) throw error;
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

const downloadTicket = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if already downloaded
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .eq('traveler_id', req.user.id)
            .single();

        if (fetchError || !booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.is_downloaded) {
            return res.status(403).json({ message: 'This ticket has already been downloaded and cannot be downloaded again to prevent multi-usage.' });
        }

        // Mark as downloaded
        const { data: updatedBooking, error: updateError } = await supabase
            .from('bookings')
            .update({ is_downloaded: true })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        res.status(200).json({ message: 'Ticket downloaded successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error downloading ticket', error: error.message });
    }
};

module.exports = { updateProfile, bookEvent, getBookings, downloadTicket };
