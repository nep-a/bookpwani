const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Mock DB: Check if user exists
        // const existingUser = await db.query('SELECT * FROM users WHERE email = ', [email]);
        // if (existingUser.rows.length > 0) return res.status(400).json({ message: 'User already exists' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Mock DB: Insert user
        const mockUser = {
            id: 'mock_id_' + Date.now(),
            username,
            email,
            role: role || 'traveler'
        };

        const token = jwt.sign(
            { id: mockUser.id, role: mockUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({ user: mockUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Mock DB: Fetch user
        // const user = await db.query('SELECT * FROM users WHERE email = ', [email]);
        // if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        // const isMatch = await bcrypt.compare(password, user.password);

        // Dummy successful login
        const mockUser = {
            id: 'mock_id_123',
            email,
            role: email.includes('host') ? 'host' : 'traveler'
        };

        const token = jwt.sign(
            { id: mockUser.id, role: mockUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({ user: mockUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

module.exports = { register, login };
