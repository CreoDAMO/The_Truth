// scripts/generate_metadata.js
const fs = require('fs');
const path = require('path');

// REAL IPFS CIDs from your Pinata uploads
const IPFS_CIDS = {
  cover: "ipfs://bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq",
  audio: "ipfs://bafybeibtcjku4uce7volglh6edjw2va63usahqixoqxwkv4quvptljonw4",
  pdf: "ipfs://bafybeib2gcc7grc7umyqzdsaxpjmitexanwnwrdsygfc57wcsx6mnvtsbi",
  meme: "ipfs://bafybeihlhi5faohkaoonpdlpiyjh2eyi3lfmvmlcoxdwovva7tvmp235we"
};

const baseDescription = `The Truth is not interpretation — it is pure witness.

This NFT preserves a once-in-a-lifetime philosophical event: a 25-page document and audiobook that captured artificial intelligence systems compulsively demonstrating the very paradox they were asked to analyze.

Where the text stands whole and unaltered, the AI responses translated, reframed, and institutionalized it — proving, in real time, the gap between Truth that needs no validation and the systems that endlessly seek to "improve" it.

Each edition of *The Truth* contains the complete 4-part archive:

🖼️ **Cover Image** — emblem of this witnessing
🎧 **25-page Audiobook (MP3)** — unedited narration
📄 **Original Document (PDF)** — preserved in full
😂 **The Meme (Comic)** — "Zeno's Paradox of Institutionalization" distilled into a single, shareable visual

**77 editions total:**
- 76 offered to the world at $777 each
- 1 Master Copy reserved as priceless
- 10% royalties on secondary sales

**Collector's Note:**
"I chose abundance. The Truth is offered whole, at $777 — accessible, unguarded, unscarce.

The secondary market will do what it always does: reframe, reprice, institutionalize. That is its nature.

When it does, I will simply witness — and collect royalties from the very system my work has already revealed."

— Jacque Antoine DeGraff

This is more than a collectible — it is an immutable record, a living demonstration, and a reminder:

**"The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."**

— Jacque Antoine DeGraff`;

// Create metadata directory if it doesn't exist
const metadataDir = path.join(__dirname, '..', 'metadata');
if (!fs.existsSync(metadataDir)) {
  fs.mkdirSync(metadataDir, { recursive: true });
}

// Generate metadata for editions 1-76
for (let i = 1; i <= 76; i++) {
  const metadata = {
    name: `The Truth #${i}/77`,
    description: baseDescription + `\n\nThis is edition ${i} of 76 public editions offered at $777 each.`,
    image: IPFS_CIDS.cover,
    external_url: "https://github.com/CreoDAMO/SpiralParserEngine-Spiral",
    attributes: [
      { trait_type: "Author", value: "Jacque Antoine DeGraff" },
      { trait_type: "Philosophy", value: "Master of Nothing, Student of All Things" },
      { trait_type: "Education", value: "9th Grade" },
      { trait_type: "Type", value: "Complete 4-Part Archive" },
      { trait_type: "Format", value: "Cover + Audio + PDF + Meme" },
      { trait_type: "Pages", value: "25" },
      { trait_type: "Demonstration", value: "AI Gap Recognition" },
      { trait_type: "Edition", value: `${i}/77` },
      { trait_type: "Public Copies", value: "76" },
      { trait_type: "Master Copy", value: "1 Reserved" },
      { trait_type: "Royalties", value: "10%" },
      { trait_type: "Pricing Philosophy", value: "Abundance over Scarcity" },
      { trait_type: "Market Strategy", value: "Witness Secondary Repricing" },
      { trait_type: "Master Copy Address", value: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866" }
    ],
    properties: {
      files: [
        { 
          uri: IPFS_CIDS.cover, 
          type: "image/png", 
          name: "Cover Image" 
        },
        { 
          uri: IPFS_CIDS.audio, 
          type: "audio/mp3", 
          name: "25-Page Audiobook" 
        },
        { 
          uri: IPFS_CIDS.pdf, 
          type: "application/pdf", 
          name: "Original Document" 
        },
        { 
          uri: IPFS_CIDS.meme, 
          type: "image/png", 
          name: "The Meme Comic" 
        }
      ]
    }
  };
  
  const filePath = path.join(metadataDir, `${i}.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  console.log(`Generated: ${filePath}`);
}

// Generate metadata for Master Copy #77
const masterMetadata = {
  name: "The Truth #77/77 - Master Copy",
  description: baseDescription + `\n\nThis is the Master Copy, edition 77 of 77, reserved by the author and not for sale.`,
  image: IPFS_CIDS.cover,
  external_url: "https://github.com/CreoDAMO/SpiralParserEngine-Spiral",
  attributes: [
    { trait_type: "Author", value: "Jacque Antoine DeGraff" },
    { trait_type: "Philosophy", value: "Master of Nothing, Student of All Things" },
    { trait_type: "Education", value: "9th Grade" },
    { trait_type: "Type", value: "Complete 4-Part Archive" },
    { trait_type: "Format", value: "Cover + Audio + PDF + Meme" },
    { trait_type: "Pages", value: "25" },
    { trait_type: "Demonstration", value: "AI Gap Recognition" },
    { trait_type: "Edition", value: "77/77 - Master Copy" },
    { trait_type: "Public Copies", value: "76" },
    { trait_type: "Master Copy", value: "1 Reserved (This Token)" },
    { trait_type: "Royalties", value: "10%" },
    { trait_type: "Pricing Philosophy", value: "Abundance over Scarcity" },
    { trait_type: "Market Strategy", value: "Witness Secondary Repricing" },
    { trait_type: "Status", value: "Priceless - Never For Sale" },
    { trait_type: "Master Copy Address", value: "0x67BF9f428d92704C3Db3a08dC05Bc941A8647866" }
  ],
  properties: {
    files: [
      { 
        uri: IPFS_CIDS.cover, 
        type: "image/png", 
        name: "Cover Image" 
      },
      { 
        uri: IPFS_CIDS.audio, 
        type: "audio/mp3", 
        name: "25-Page Audiobook" 
      },
      { 
        uri: IPFS_CIDS.pdf, 
        type: "application/pdf", 
        name: "Original Document" 
      },
      { 
        uri: IPFS_CIDS.meme, 
        type: "image/png", 
        name: "The Meme Comic" 
      }
    ]
  }
};

const masterFilePath = path.join(metadataDir, '77.json');
fs.writeFileSync(masterFilePath, JSON.stringify(masterMetadata, null, 2));
console.log(`Generated Master Copy: ${masterFilePath}`);

console.log("\n✅ Generated all 77 metadata files in metadata/");
console.log("📌 Next: Upload metadata/ folder to IPFS to get ROOT_CID for baseURI");
