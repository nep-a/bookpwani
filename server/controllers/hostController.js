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
        const { title, description, price, date } = req.body;
        const eventImage = req.file ? req.file.path : null;

        const { data: newEvent, error } = await supabase
            .from('events')
            .insert([{
                host_id: req.user.id,
                title,
                description,
                price,
                date,
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

module.exports = { updateProfile, createEvent, updateEvent, getEvents, submitVerification };
