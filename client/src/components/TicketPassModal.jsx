import React from 'react';
import { FaTimes, FaPrint, FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaShieldAlt } from 'react-icons/fa';

const TicketPassModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content digital-ticket-modal-landscape" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close modal">
                    <FaTimes />
                </button>

                <div className="digital-ticket-pass landscape-ticket" id="printable-ticket">
                    {/* Left Stub (QR Code & Brand) */}
                    <div className="ticket-left-stub">
                        <div className="stub-brand">bookpwani</div>
                        <div className="stub-qr">
                            <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="120" height="120" fill="white" rx="8" />
                                <rect x="12" y="12" width="30" height="30" rx="4" stroke="#111" strokeWidth="4" fill="none" />
                                <rect x="20" y="20" width="14" height="14" rx="2" fill="#111" />
                                <rect x="78" y="12" width="30" height="30" rx="4" stroke="#111" strokeWidth="4" fill="none" />
                                <rect x="86" y="20" width="14" height="14" rx="2" fill="#111" />
                                <rect x="12" y="78" width="30" height="30" rx="4" stroke="#111" strokeWidth="4" fill="none" />
                                <rect x="20" y="86" width="14" height="14" rx="2" fill="#111" />
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
                        <div className="stub-code">{booking.ticketCode}</div>
                        <div className="security-notice">
                            <FaShieldAlt /> Valid for 1-time scanning
                        </div>
                    </div>

                    {/* Divider Cutout */}
                    <div className="ticket-cutout">
                        <div className="notch top-notch"></div>
                        <div className="dashed-cutline"></div>
                        <div className="notch bottom-notch"></div>
                    </div>

                    {/* Main Ticket Body (Event Details ONLY) */}
                    <div className="ticket-main-body">
                        {booking.eventImage && (
                            <div className="ticket-bg-image" style={{ backgroundImage: \url(\)\ }}>
                                <div className="ticket-overlay"></div>
                            </div>
                        )}
                        
                        <div className="ticket-content-wrapper">
                            <div className="ticket-top-row">
                                <span className="ticket-status-pill confirmed">
                                    <FaCheckCircle /> Confirmed
                                </span>
                                <span className="ticket-tier-badge">
                                    <FaTicketAlt /> {booking.ticketTierName || 'General Pass'} x{booking.quantity || booking.tickets_count || 1}
                                </span>
                            </div>
                            
                            <h2 className="ticket-event-title">{booking.eventTitle || booking.event?.title}</h2>
                            
                            <div className="ticket-event-details-row">
                                <div className="detail-item">
                                    <div className="detail-icon"><FaCalendarAlt /></div>
                                    <div className="detail-text">
                                        <strong>Date & Time</strong>
                                        <p>{booking.eventDate || booking.event?.date || booking.event?.startDate}</p>
                                        <p>{booking.eventTime || booking.event?.time || 'Doors Open Early'}</p>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-icon"><FaMapMarkerAlt /></div>
                                    <div className="detail-text">
                                        <strong>Venue / Location</strong>
                                        <p>{booking.eventVenue || booking.event?.venue || booking.event?.location}</p>
                                    </div>
                                </div>
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
