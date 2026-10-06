import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import './OrderStatusTimeline.css';

const STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const OrderStatusTimeline = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <div className="order-timeline order-timeline-cancelled">
        <FiX size={18} />
        <span>This order was cancelled.</span>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="order-timeline">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div className={`order-timeline-step ${done ? 'done' : ''} ${active ? 'active' : ''}`} key={step}>
            <div className="order-timeline-dot">{done ? <FiCheck size={12} /> : i + 1}</div>
            <span className="order-timeline-label">{step}</span>
            {i < STEPS.length - 1 && <div className={`order-timeline-line ${done ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTimeline;
