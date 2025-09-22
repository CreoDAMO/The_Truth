
class AIMerchGenerator {
    constructor() {
        this.apiEndpoint = '/api/ai/generate-merch';
        this.supportedFormats = ['tshirt', 'hoodie', 'poster', 'sticker'];
    }

    // Generate merch design from NFT
    async generateFromNFT(nftData, options = {}) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nft: nftData,
                    style: options.style || 'philosophical',
                    format: options.format || 'tshirt',
                    colorScheme: options.colorScheme || 'gold-accent',
                    customPrompt: options.customPrompt || ''
                })
            });

            const result = await response.json();
            
            if (result.success) {
                return {
                    designUrl: result.design.imageUrl,
                    mockupUrl: result.design.mockupUrl,
                    printReadyUrl: result.design.printReadyUrl,
                    productId: result.productId,
                    estimatedPrice: result.pricing.total,
                    processingTime: result.estimatedCompletion
                };
            } else {
                throw new Error(result.error || 'AI generation failed');
            }
        } catch (error) {
            console.error('AI Merch Generation Error:', error);
            throw error;
        }
    }

    // Analyze NFT for design potential
    async analyzeNFT(tokenId, contractAddress) {
        try {
            const response = await fetch('/api/ai/analyze-nft-for-merch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nftTokenId: tokenId, contractAddress })
            });

            return await response.json();
        } catch (error) {
            console.error('NFT Analysis Error:', error);
            throw error;
        }
    }

    // Get real-time design preview
    async getDesignPreview(nftData, style) {
        // This would integrate with DALL-E, Midjourney, or Stable Diffusion
        const prompt = this.generatePrompt(nftData, style);
        
        return {
            prompt,
            previewUrl: '/api/ai/design-preview',
            confidence: 0.95
        };
    }

    generatePrompt(nftData, style) {
        const basePrompt = `Create a ${style} design for merchandise based on NFT: ${nftData.name}. `;
        const attributes = nftData.attributes?.map(attr => `${attr.trait_type}: ${attr.value}`).join(', ') || '';
        
        return basePrompt + `Incorporate elements: ${attributes}. Style: minimalist, philosophical, truth-seeking aesthetic.`;
    }
}

// Make available globally
window.AIMerchGenerator = AIMerchGenerator;
