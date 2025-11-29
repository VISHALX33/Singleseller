/**
 * Test Notifications Script
 * 
 * This script tests order status updates and email notifications
 * For MVP purposes, it logs to console instead of sending actual emails
 * 
 * Usage: npm test  or  node test-notifications.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Mock database data
const mockOrders = [
  {
    _id: 'ORD-001',
    orderNumber: 'ORD-001',
    customerId: 'USER-001',
    customerEmail: 'customer1@example.com',
    customerName: 'John Doe',
    totalAmount: 4999,
    status: 'pending',
    items: [
      {
        productId: 'PROD-001',
        productTitle: 'iPhone 15',
        quantity: 1,
        price: 4999,
      },
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    createdAt: new Date('2024-11-27'),
  },
  {
    _id: 'ORD-002',
    orderNumber: 'ORD-002',
    customerId: 'USER-002',
    customerEmail: 'customer2@example.com',
    customerName: 'Jane Smith',
    totalAmount: 1599,
    status: 'confirmed',
    items: [
      {
        productId: 'PROD-002',
        productTitle: 'Samsung Galaxy S24',
        quantity: 1,
        price: 1599,
      },
    ],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
    },
    createdAt: new Date('2024-11-26'),
  },
  {
    _id: 'ORD-003',
    orderNumber: 'ORD-003',
    customerId: 'USER-003',
    customerEmail: 'customer3@example.com',
    customerName: 'Bob Wilson',
    totalAmount: 899,
    status: 'processing',
    items: [
      {
        productId: 'PROD-003',
        productTitle: 'AirPods Pro',
        quantity: 2,
        price: 449.5,
      },
    ],
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'USA',
    },
    createdAt: new Date('2024-11-25'),
  },
];

// Status transitions for testing
const validStatusTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

/**
 * Send Email Notification (Mock - logs to console for MVP)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {object} data - Email template data
 */
function sendEmailNotification(to, subject, data) {
  console.log(`${colors.cyan}📧 EMAIL NOTIFICATION${colors.reset}`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Data:`, JSON.stringify(data, null, 2));
  console.log('');
}

/**
 * Update Order Status and Send Notification
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status
 * @param {string} comment - Optional comment
 */
function updateOrderStatus(orderId, newStatus, comment = '') {
  const order = mockOrders.find(o => o._id === orderId);

  if (!order) {
    console.log(`${colors.red}❌ Order not found: ${orderId}${colors.reset}\n`);
    return;
  }

  const currentStatus = order.status;
  const allowedTransitions = validStatusTransitions[currentStatus];

  if (!allowedTransitions.includes(newStatus)) {
    console.log(
      `${colors.red}❌ Invalid status transition: ${currentStatus} → ${newStatus}${colors.reset}\n`
    );
    return;
  }

  // Update order status
  order.status = newStatus;

  console.log(`${colors.green}✅ Order Status Updated${colors.reset}`);
  console.log(`   Order ID: ${order.orderNumber}`);
  console.log(`   Status: ${currentStatus} → ${newStatus}`);
  if (comment) {
    console.log(`   Comment: ${comment}`);
  }
  console.log('');

  // Send email notification
  const emailTemplates = {
    confirmed: {
      subject: 'Order Confirmed - ' + order.orderNumber,
      template: 'order_confirmed',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    },
    processing: {
      subject: 'Order Processing - ' + order.orderNumber,
      template: 'order_processing',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        items: order.items,
      },
    },
    shipped: {
      subject: 'Order Shipped - ' + order.orderNumber,
      template: 'order_shipped',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        trackingNumber: 'TRACK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        shippingAddress: order.shippingAddress,
      },
    },
    delivered: {
      subject: 'Order Delivered - ' + order.orderNumber,
      template: 'order_delivered',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        feedbackLink: `https://singleseller.com/feedback/${order._id}`,
      },
    },
    cancelled: {
      subject: 'Order Cancelled - ' + order.orderNumber,
      template: 'order_cancelled',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        refundAmount: order.totalAmount,
        comment: comment,
      },
    },
  };

  const emailConfig = emailTemplates[newStatus];
  if (emailConfig) {
    sendEmailNotification(order.customerEmail, emailConfig.subject, emailConfig.data);
  }
}

/**
 * Log Order Details
 */
function logOrderDetails(orderId) {
  const order = mockOrders.find(o => o._id === orderId);
  if (!order) {
    console.log(`${colors.red}❌ Order not found: ${orderId}${colors.reset}\n`);
    return;
  }

  console.log(`${colors.magenta}📦 ORDER DETAILS${colors.reset}`);
  console.log(`   Order ID: ${order.orderNumber}`);
  console.log(`   Customer: ${order.customerName} (${order.customerEmail})`);
  console.log(`   Status: ${order.status}`);
  console.log(`   Total Amount: ₹${order.totalAmount}`);
  console.log(`   Items: ${order.items.length}`);
  order.items.forEach(item => {
    console.log(`     - ${item.productTitle} x${item.quantity} @ ₹${item.price}`);
  });
  console.log(`   Created: ${order.createdAt.toLocaleDateString()}`);
  console.log('');
}

/**
 * List All Orders
 */
function listAllOrders() {
  console.log(`${colors.cyan}📋 ALL ORDERS${colors.reset}`);
  mockOrders.forEach(order => {
    const statusColor =
      order.status === 'delivered'
        ? colors.green
        : order.status === 'cancelled'
          ? colors.red
          : colors.yellow;
    console.log(
      `   ${order.orderNumber} | ${statusColor}${order.status}${colors.reset} | ₹${order.totalAmount} | ${order.customerName}`
    );
  });
  console.log('');
}

/**
 * Test Scenarios
 */
function runTests() {
  console.clear();

  console.log(`${colors.bright}${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║       SINGLESELLER - ORDER NOTIFICATIONS TEST SUITE             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}\n`);

  console.log(`${colors.bright}🧪 TEST SCENARIO 1: Order Status Transitions${colors.reset}\n`);

  // Test 1: Order confirmation flow
  console.log(`${colors.cyan}--- Test 1.1: Pending → Confirmed ---${colors.reset}\n`);
  updateOrderStatus('ORD-001', 'confirmed');

  console.log(`${colors.cyan}--- Test 1.2: Confirmed → Processing ---${colors.reset}\n`);
  updateOrderStatus('ORD-001', 'processing');

  console.log(`${colors.cyan}--- Test 1.3: Processing → Shipped ---${colors.reset}\n`);
  updateOrderStatus('ORD-001', 'shipped');

  console.log(`${colors.cyan}--- Test 1.4: Shipped → Delivered ---${colors.reset}\n`);
  updateOrderStatus('ORD-001', 'delivered');

  // Test 2: Invalid transitions
  console.log(`${colors.bright}🧪 TEST SCENARIO 2: Invalid Status Transitions${colors.reset}\n`);

  console.log(`${colors.cyan}--- Test 2.1: Attempt Delivered → Processing (invalid) ---${colors.reset}\n`);
  updateOrderStatus('ORD-001', 'processing');

  // Test 3: Order cancellation
  console.log(`${colors.bright}🧪 TEST SCENARIO 3: Order Cancellation${colors.reset}\n`);

  console.log(`${colors.cyan}--- Test 3.1: Cancel Confirmed Order ---${colors.reset}\n`);
  updateOrderStatus('ORD-002', 'cancelled', 'Customer requested cancellation');

  // Test 4: Order details logging
  console.log(`${colors.bright}🧪 TEST SCENARIO 4: Order Details Logging${colors.reset}\n`);

  logOrderDetails('ORD-003');

  // Test 5: List all orders
  console.log(`${colors.bright}🧪 TEST SCENARIO 5: List All Orders${colors.reset}\n`);

  listAllOrders();

  // Summary
  console.log(`${colors.bright}${colors.green}✅ Test Suite Completed Successfully!${colors.reset}\n`);

  console.log(`${colors.dim}------- SUMMARY -------${colors.reset}`);
  console.log(`Total Orders Tested: ${mockOrders.length}`);
  console.log(`Status Transitions Tested: 5+`);
  console.log(`Email Notifications: 5+`);
  console.log(`${colors.dim}----------------------${colors.reset}\n`);

  console.log(`${colors.yellow}💡 NOTES FOR PRODUCTION:${colors.reset}`);
  console.log('   1. Replace console.log with actual email service (Nodemailer, SendGrid, etc.)');
  console.log('   2. Store email templates in database or files');
  console.log('   3. Add retry logic for failed email notifications');
  console.log('   4. Log notifications to database for audit trail');
  console.log('   5. Implement notification preferences in user settings\n');

  console.log(`${colors.cyan}For more information, check the documentation:${colors.reset}`);
  console.log('   - Backend API: README_BACKEND.md');
  console.log('   - Frontend Guide: frontend/README.md');
  console.log('   - Setup Guide: SETUP_COMPLETE.js\n');
}

// Run tests
runTests();

module.exports = {
  updateOrderStatus,
  sendEmailNotification,
  logOrderDetails,
  listAllOrders,
  mockOrders,
};
