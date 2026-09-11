import React from 'react';
import { FaTimes, FaPrint, FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const TicketPassModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content digital-ticket-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close modal">
                    <FaTimes />
                </button>

                <div className="digital-ticket-pass" id="printable-ticket">
                    {/* Top Header */}
                    <div className="ticket-header">
                        <div className="ticket-brand">
                            <span className="brand-dot" />
                            <h3>bookpwani</h3>
                        </div>
                        <span className="ticket-status-pill confirmed">
                            <FaCheckCircle /> Confirmed Pass
                        </span>
                    </div>

                    {/* Event Banner */}
                    {booking.eventImage && (
                        <div className="ticket-event-banner">
                            <img src={booking.eventImage} alt={booking.eventTitle} />
                            <div className="ticket-banner-grad" />
                            <h2 className="ticket-event-name">{booking.eventTitle}</h2>
                        </div>
                    )}

                    {/* Ticket Details Grid */}
                    <div className="ticket-body">
                        <div className="ticket-info-grid">
                            <div className="ticket-info-col">
                                <span className="ticket-label"><FaCalendarAlt /> Date & Time</span>
                                <span className="ticket-value">{booking.eventDate}</span>
                                <span className="ticket-subval">{booking.eventTime || 'Doors Open Early'}</span>
                            </div>
                            <div className="ticket-info-col">
                                <span className="ticket-label"><FaMapMarkerAlt /> Venue / Location</span>
                                <span className="ticket-value">{booking.eventVenue}</span>
                            </div>
                        </div>

                        <div className="ticket-divider">
                            <div className="notch-left" />
                            <div className="dashed-line" />
                            <div className="notch-right" />
                        </div>

                        <div className="ticket-info-grid">
                            <div className="ticket-info-col">
                                <span className="ticket-label">Attendee Name</span>
                                <span className="ticket-value">{booking.travelerName}</span>
                                <span className="ticket-subval">{booking.travelerEmail}</span>
                            </div>
                            <div className="ticket-info-col">
                                <span className="ticket-label"><FaTicketAlt /> Tier & Quantity</span>
                                <span className="ticket-value tier-highlight">{booking.ticketTierName}</span>
                                <span className="ticket-subval">{booking.quantity} Pass(es) • Ksh {booking.totalPrice?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Security QR Section */}
                        <div className="ticket-qr-section">
                            <div className="ticket-qr-box">
                                {/* Stylized SVG QR Pattern */}
                                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="120" height="120" fill="white" rx="8" />
                                    {/* Corners */}
                                    <rect x="12" y="12" width="30" height="30" rx="4" stroke="#111" strokeWidth="4" fill="none" />
                                    <rect x="20" y="20" width="14" height="14" rx="2" fill="#111" />
                                    <rect x="78" y="12" width="30" height="30" rx="4" stroke="#111" strokeWidth="4" fill="none" />
                                    <rect x="86" y="20" width="14" height="14" rx="2" fill="#111" />
                                    <rect x="12" y="78" width="30" height="30" rx="4" stroke="#111" strokeWidth="4" fill="none" />
                                    <rect x="20" y="86" width="14" height="14" rx="2" fill="#111" />
                                    {/* Matrix blocks */}
                                    <rect x="52" y="16" width="8" height="8" fill="#111" />
                                    <rect x="62" y="26" width="8" height="8" fill="#111" />
                                    <rect x="52" y="36" width="12" height="6" fill="#111" />
                                    <rect x="16" y="52" width="8" height="12" fill="#111" />
                                    <rect x="32" y="56" width="8" height="8" fill="#111" />
                                    <rect x="50" y="52" width="20" height="16" rx="2" fill="#ff0050" />
                                    <rect x="78" y="52" width="12" height="8" fill="#111" />
                                    <rect x="96" y="58" width="8" height="8" fill="#111" />
                                    <rect x="52" y="78" width="12" height="8" fill="#111" />
                                    <rect x="72" y="86" width="8" height="16" fill="#111" />
                                    <rect x="88" y="78" width="14" height="8" fill="#111" />
                                    <rect x="88" y="96" width="16" height="8" fill="#111" />
                                </svg>
                            </div>
                            <div className="ticket-code-block">
                                <span className="code-label">TICKET REFERENCE</span>
                                <span className="code-val">{booking.ticketCode}</span>
                                <span className="security-notice">
                                    <FaShieldAlt /> Valid for 1-time scanning at gate
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="ticket-modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button className="btn btn-primary" onClick={handlePrint}>
                        <FaPrint /> Print / Save PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketPassModal;
