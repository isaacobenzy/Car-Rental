const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Route to handle the booking form submission
app.post('/bookings', (req, res) => {
    console.log('Request received:', req.body);

    const {
        firstName,
        lastName,
        email,
        mobile,
        address1,
        address2,
        city,
        card,
        pickupDate,
        returnDate,
        carSelection,
        paymentMethod
    } = req.body;

    const formData = `
        Booking Details:
        - Name: ${firstName} ${lastName}
        - Email: ${email}
        - Mobile: ${mobile}
        - Card: ${card}
        - Address: ${address1}, ${address2 ? address2 + ',' : ''} ${city}
        - Pick-up Date: ${pickupDate}
        - Return Date: ${returnDate}
        - Car Selected: ${carSelection}
        - Payment Method: ${paymentMethod}
    `;

    // Setup Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nakaata247@gmail.com', // Replace with your Gmail address
            pass: 'dqob vwue hmiq vjbr'  // Replace with your Gmail app-specific password
        }
    });

    // Email options for client
    let mailOptionsClient = {
        from: 'nakaata247@gmail.com',
        to: email,
        subject: 'Your Booking Confirmation - Nakaata Motors',
        text: `Dear ${firstName},\n\nThank you for booking with Nakaata Motors. Here are your booking details:\n${formData}\n\nPlease remember to bring along your Ghana Card used for verification.\n\nBest regards,\nNakaata Motors`
    };

    // Email options for admin
    let mailOptionsAdmin = {
        from: 'nakaata247@gmail.com',
        to: 'nakaata247@gmail.com', // Replace with the admin's email address
        subject: 'New Car Booking - Nakaata Motors',
        text: `A new car booking has been made. Here are the details:\n${formData}`
    };

    // Send email to client first
    transporter.sendMail(mailOptionsClient, (error, info) => {
        if (error) {
            console.error('Error sending email to client:', error);
            return res.status(500).send('Failed to send confirmation email to client.');
        }
        console.log('Email sent to client: ' + info.response);

        // Send email to admin after client email is sent
        transporter.sendMail(mailOptionsAdmin, (error, info) => {
            if (error) {
                console.error('Error sending email to admin:', error);
                return res.status(500).send('Failed to notify the admin.');
            }
            console.log('Email sent to admin: ' + info.response);
            res.status(200).send('Booking form submitted successfully and emails sent!');
        });
    });
});

// Separate route to handle the contact form submission
app.post('/contact-us', (req, res) => {
    res.send('Test route working');
    console.log('Contact form received:', req.body);

    const { name, email, subject, message } = req.body;

    const contactMessage = `
        Contact Us Message:
        - Name: ${name}
        - Email: ${email}
        - Subject: ${subject}
        - Message: ${message}
    `;

    // Reuse the transporter configuration
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nakaata247@gmail.com',
            pass: 'dqob vwue hmiq vjbr'
        }
    });

    // Email options for admin (contact form)
    let mailOptionsAdmin = {
        from: 'nakaata247@gmail.com',
        to: 'nakaata247@gmail.com', // Replace with the admin's email address
        subject: `Contact Form Submission: ${subject}`,
        text: contactMessage
    };

    // Send email to admin
    transporter.sendMail(mailOptionsAdmin, (error, info) => {
        if (error) {
            console.error('Error sending contact message:', error);
            return res.status(500).send('Failed to send contact message.');
        }
        console.log('Contact message sent to admin: ' + info.response);
        res.status(200).send('Contact message sent successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
