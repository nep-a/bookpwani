const supabase = require('../config/supabase');

const updateProfile = async (req, res) => {
    try {
        const { name, verificationDetails } = req.body;
        const profilePic = req.file ? req.file.path : null;

        const updateData = {};
        if (name) updateData.username = name;
        if (verificationDetails) updateData.verification_details = verificationDetails;
        if (profilePic) updateData.profile_pic = profilePic;

        const { data: updatedHost, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        delete updatedHost.password;
        res.status(200).json({ message: 'Host profile updated successfully', host: updatedHost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const { title, description, price, date, venue, time, category, capacity, vipPrice, vipCapacity } = req.body;
        const eventImage = req.file ? req.file.path : null;

        const { data: newEvent, error } = await supabase
            .from('events')
            .insert([{
                host_id: req.user.id,
                title,
                description,
                price: price || 0,
                date,
                venue,
                time,
                category,
                capacity: capacity || 0,
                vip_price: vipPrice || null,
                vip_capacity: vipCapacity || 0,
                image: eventImage
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, date } = req.body;
        const eventImage = req.file ? req.file.path : null;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (date) updateData.date = date;
        if (eventImage) updateData.image = eventImage;

        const { data: updatedEvent, error } = await supabase
            .from('events')
            .update(updateData)
            .eq('id', id)
            .eq('host_id', req.user.id) // Ensure they own it
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .eq('host_id', req.user.id);

        if (error) throw error;
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)
            .eq('host_id', req.user.id);

        if (error) throw error;
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

const submitVerification = async (req, res) => {
    try {
        const { businessName, ownerId, staffPhone } = req.body;
        const passportFile = req.file ? req.file.path : null;

        const verificationData = JSON.stringify({
            businessName,
            ownerId,
            staffPhone,
            passportFile
        });

        const { data: updatedHost, error } = await supabase
            .from('users')
            .update({ verification_details: verificationData })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        
        delete updatedHost.password;
        res.status(200).json({ message: 'Verification submitted successfully', host: updatedHost });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting verification', error: error.message });
    }
};


const getBookings = async (req, res) => {
    const supabase = require('../config/supabase');
    try {
        const { data: events, error: eventError } = await supabase
            .from('events')
            .select('id')
            .eq('host_id', req.user.id);
            
        if (eventError) throw eventError;
        
        if (!events || events.length === 0) {
            return res.status(200).json({ bookings: [] });
        }
        
        const eventIds = events.map(e => e.id);
        
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, event:events(*)')
            .in('event_id', eventIds);

        if (error) throw error;
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

const applyDiscount = async (req, res) => {
    const supabase = require('../config/supabase');
    try {
        const { id } = req.params;
        const { discount_percentage, discount_end_date } = req.body;

        const { data: event, error } = await supabase
            .from('events')
            .update({ 
                discount_percentage, 
                discount_end_date 
            })
            .eq('id', id)
            .eq('host_id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ message: 'Discount applied', event });
    } catch (error) {
        res.status(500).json({ message: 'Error applying discount', error: error.message });
    }
};
module.exports = { updateProfile, createEvent, updateEvent, getEvents, deleteEvent, submitVerification, getBookings, applyDiscount };
