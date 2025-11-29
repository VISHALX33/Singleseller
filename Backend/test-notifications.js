// Order status notification simulation script
// Run with: npm test (backend)

console.log('--- Order Notification Test Start ---');

const fakeOrder = {
	orderId: 'ORD' + Date.now(),
	userEmail: 'customer@example.com',
	statuses: ['placed','confirmed','packed','shipped','delivered']
};

function simulateEmail(to, subject, body) {
	console.log(`[EMAIL] to:${to} subject:${subject}\n${body}\n`);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
	console.log(`Creating order ${fakeOrder.orderId} for ${fakeOrder.userEmail}`);
	simulateEmail(fakeOrder.userEmail, 'Order Placed', `Your order ${fakeOrder.orderId} has been placed.`);
	for (let i = 1; i < fakeOrder.statuses.length; i++) {
		const status = fakeOrder.statuses[i];
		await delay(300);
		console.log(`Updating status -> ${status}`);
		simulateEmail(fakeOrder.userEmail, `Order ${status}`, `Your order ${fakeOrder.orderId} is now ${status}.`);
	}
	console.log('All status notifications simulated.');
	console.log('--- Order Notification Test End ---');
})();
