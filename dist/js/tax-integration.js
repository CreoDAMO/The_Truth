
// Tax Integration for The Truth NFT Platform
// Handles automatic tax calculation and collection for all sales

class TaxIntegration {
    constructor() {
        this.stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        this.taxIdNumber = "23-8019835728-2"; // Florida Sales Tax ID
        this.initialized = false;
    }

    // Initialize Stripe Tax
    async initialize() {
        try {
            if (!this.stripeSecretKey) {
                throw new Error("STRIPE_SECRET_KEY environment variable required");
            }
            
            this.stripe = require('stripe')(this.stripeSecretKey);
            this.initialized = true;
            console.log("Tax integration initialized with Florida Tax ID:", this.taxIdNumber);
            return true;
        } catch (error) {
            console.error("Tax integration initialization failed:", error);
            return false;
        }
    }

    // Calculate tax for NFT sales (blockchain)
    async calculateNFTTax(amount, customerAddress) {
        if (!this.initialized) await this.initialize();

        try {
            const taxCalculation = await this.stripe.tax.calculations.create({
                currency: 'usd',
                customer_details: {
                    address: this.parseAddress(customerAddress),
                    address_source: 'billing'
                },
                line_items: [
                    {
                        amount: Math.round(amount * 100), // Convert to cents
                        reference: 'the-truth-nft',
                        tax_behavior: 'exclusive',
                        tax_code: 'txcd_99999999' // Digital products
                    }
                ],
                tax_date: Math.floor(Date.now() / 1000)
            });

            return {
                success: true,
                taxAmount: taxCalculation.tax_amount_exclusive / 100,
                totalAmount: taxCalculation.amount_total / 100,
                taxBreakdown: taxCalculation.tax_breakdown,
                calculationId: taxCalculation.id
            };
        } catch (error) {
            console.error("NFT tax calculation failed:", error);
            return {
                success: false,
                error: error.message,
                taxAmount: 0,
                totalAmount: amount
            };
        }
    }

    // Calculate tax for traditional sales (shop)
    async calculateShopTax(items, customerInfo) {
        if (!this.initialized) await this.initialize();

        try {
            const lineItems = items.map(item => ({
                amount: Math.round(item.price * 100),
                reference: item.sku || item.name,
                tax_behavior: 'exclusive',
                tax_code: item.type === 'audiobook' ? 'txcd_99999999' : 'txcd_99999999' // Digital products
            }));

            const taxCalculation = await this.stripe.tax.calculations.create({
                currency: 'usd',
                customer_details: {
                    address: customerInfo.address,
                    address_source: 'billing'
                },
                line_items: lineItems,
                tax_date: Math.floor(Date.now() / 1000)
            });

            return {
                success: true,
                taxAmount: taxCalculation.tax_amount_exclusive / 100,
                totalAmount: taxCalculation.amount_total / 100,
                taxBreakdown: taxCalculation.tax_breakdown,
                calculationId: taxCalculation.id
            };
        } catch (error) {
            console.error("Shop tax calculation failed:", error);
            return {
                success: false,
                error: error.message,
                taxAmount: 0,
                totalAmount: items.reduce((sum, item) => sum + item.price, 0)
            };
        }
    }

    // Create tax transaction record
    async createTaxTransaction(calculationId, transactionId, saleType) {
        try {
            const transaction = await this.stripe.tax.transactions.create({
                calculation: calculationId,
                reference: `${saleType}-${transactionId}`,
                metadata: {
                    platform: 'the-truth-nft',
                    sale_type: saleType,
                    tax_id: this.taxIdNumber
                }
            });

            console.log(`Tax transaction created: ${transaction.id} for ${saleType}`);
            return {
                success: true,
                transactionId: transaction.id
            };
        } catch (error) {
            console.error("Tax transaction creation failed:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Parse customer address for tax calculation
    parseAddress(addressString) {
        // Default to Florida if no specific address provided
        if (!addressString || typeof addressString !== 'string') {
            return {
                line1: '',
                city: 'Miami',
                state: 'FL',
                postal_code: '33101',
                country: 'US'
            };
        }

        // Simple address parsing - in production, use a proper address validation service
        return {
            line1: addressString,
            city: 'Miami',
            state: 'FL',
            postal_code: '33101',
            country: 'US'
        };
    }

    // Generate tax report
    async generateTaxReport(startDate, endDate) {
        try {
            const transactions = await this.stripe.tax.transactions.list({
                created: {
                    gte: Math.floor(new Date(startDate).getTime() / 1000),
                    lte: Math.floor(new Date(endDate).getTime() / 1000)
                }
            });

            const report = {
                period: { startDate, endDate },
                taxId: this.taxIdNumber,
                totalSales: 0,
                totalTax: 0,
                transactions: transactions.data.map(tx => ({
                    id: tx.id,
                    reference: tx.reference,
                    amount: tx.amount_total / 100,
                    tax: tx.amount_tax / 100,
                    created: new Date(tx.created * 1000).toISOString()
                }))
            };

            report.totalSales = report.transactions.reduce((sum, tx) => sum + tx.amount, 0);
            report.totalTax = report.transactions.reduce((sum, tx) => sum + tx.tax, 0);

            return report;
        } catch (error) {
            console.error("Tax report generation failed:", error);
            return null;
        }
    }

    // Webhook handler for tax events
    async handleTaxWebhook(event) {
        switch (event.type) {
            case 'tax.calculation.created':
                console.log('Tax calculation created:', event.data.object.id);
                break;
            case 'tax.transaction.created':
                console.log('Tax transaction created:', event.data.object.id);
                break;
            default:
                console.log('Unhandled tax event:', event.type);
        }
    }
}

// Export for use in server
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaxIntegration;
} else {
    window.TaxIntegration = TaxIntegration;
}
