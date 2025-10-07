
import React, { useState } from 'react';
import { useTruth } from '../context/TruthContext';

const Deploy = () => {
  const { walletConnected, requestDeploymentSignature } = useTruth();
  const [selectedContract, setSelectedContract] = useState(null);
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!selectedContract) {
      alert('Please select a contract to deploy');
      return;
    }

    try {
      setDeploying(true);
      
      const contractData = {
        contract: selectedContract,
        name: contracts[selectedContract].name,
        supply: contracts[selectedContract].supply,
        price: contracts[selectedContract].price
      };
      
      // Request deployment signature (Tier 3: Smart Contract Deployment)
      const signature = await requestDeploymentSignature(contractData);
      
      if (signature) {
        console.log('Deployment signature received:', signature);
        alert('Deployment signature verified! In a production environment, this would deploy the contract to the blockchain.');
        // Here you would call the actual deployment function
      }
    } catch (error) {
      console.error('Deployment error:', error);
      alert('Deployment was cancelled or failed');
    } finally {
      setDeploying(false);
    }
  };

  const contracts = {
    TheTruth: {
      name: "The Truth NFT",
      supply: "77 editions",
      price: "0.169 ETH (~$777)",
      coverImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidgadado5nyfxkua3mkiqbxsqkvrbqctkrqap7oghnkb77qo4steq",
      metadata: "ipfs://bafybeicvdksqen6adtjdtovlojli62qiflgafvxopz7uy4fy6qeshuhgbu",
      ipfsAssets: {
        audioMP3: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeibtcjku4uce7volglh6edjw2va63usahqixoqxwkv4quvptljonw4",
        audioWAV: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeighlqh73gnbu6l5hwzwzs3zdjhdyghuqhpdtqgeqjuwnwjw3tcm34",
        documentPDF: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib2gcc7grc7umyqzdsaxpjmitexanwnwrdsygfc57wcsx6mnvtsbi",
        memeCover: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeihlhi5faohkaoonpdlpiyjh2eyi3lfmvmlcoxdwovva7tvmp235we"
      }
    },
    TruthBonusGift: {
      name: "Truth Bonus Gift - Five Acts",
      supply: "145,000 editions",
      price: "0.039 ETH (~$145)",
      coverImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafkreibx3bnrvluzzuzving6wnkgt3wzh4tekhequcbyiielyffmfk2j6a",
      metadata: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeifbx5p5xprjqrw5d34vw5bytl77e32lmbgpxp6kbefwsorkydyruy",
      ipfsAssets: {
        audioMP3: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeibtudgvfggsjdpyikuwh67pdktqqznpcfv5b2xpwyjn62myero2wy",
        audioWAV: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeieyqpftkopnlaxqckhqwt6houzgpzp4bateepgatmykfomzgnv2ta",
        documentPDF: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeid4t2jkcolfhs6zrwdv4ch6z2lnodywqpzjudpi5w24gl4rr7n5sq",
        comic1: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafkreiec7rbdvhnrrwgb6djpio22dhmb3kkjhxxsv5iwchxceesndt26ca",
        comic2: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafkreibq6iobz5j7mbr6onv3p5ceajp7mtzmxgz7ohl2xgshczr36fiorm"
      }
    },
    TruthPartThree: {
      name: "Truth Part Three - Blackpaper",
      supply: "444 editions",
      price: "0.478 ETH (~$1,777)",
      coverImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib2ujzv6k3m5t4acypn7xs3nufobsiytyrcnxh6aeevrodbuuinwu",
      metadata: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeifbx5p5xprjqrw5d34vw5bytl77e32lmbgpxp6kbefwsorkydyruy",
      ipfsAssets: {
        audioMP3: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeihzptekqfp7fxcfwzi7bkh6ggwo3lmuzsrczv3k7gslktj6fh25di",
        audioWAV: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib22yqsq73q7shtk3ymdcniepf2vovf4dkt3s2vxyxaozeagvgkuu",
        documentPDF: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeicrpqrpazlwhyi4dzgw45ol2rmoo6sg4sjmbd4av53wk7zgzzxbiy",
        comic1: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeih4fwch34ot7wiz2m5wc5cvvwez5itpnkqanhcehyj4735kg4yntq",
        comic2: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeianuakdbawhlygcdx6dn5oqpifms7j3va4h4dwsbvjljr4cmqnuzm",
        comic3: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeihimxklbqmdi7ugtkvorblvzxers253le2lgvaqxxnfrhhzfuuyii"
      }
    },
    BlackPrintNFT: {
      name: "The BlackPrint NFT",
      supply: "TBD editions",
      price: "TBD",
      coverImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeieyrwfjajgek2pco3wrjnqk7ac6suyjbok5wf7anz2rqeshrfjmo4",
      metadata: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeifbx5p5xprjqrw5d34vw5bytl77e32lmbgpxp6kbefwsorkydyruy",
      ipfsAssets: {
        documentPDF: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeib6r3ymr2apauxmtfijziruqise36hyirvglbdhmd2lyxb4bd37zu",
        gateImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeia4mp54o4at3hpgtjmj27gqt4lnmy7lefxsyxsutdr5mjzmjxsbyy",
        video1: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeifzyktwxfg3ldagxjstmo6qnhb5nyplfz5zijenoy5rlpsrm6hhlm",
        video2: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiezdenul7bzunhq2eliva7jmdclhgq5rvghkkn6dkywp6ltaq3cga",
        video3: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiawyg2edyvy7bk4gllesn2ol6r6z73xefdrjt2sdwfgwuihwyoeoa",
        video4: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidp2wqg4dmn6eojmpsglrhyyivjozysi6fty24vvsprcrhnmoqmee",
        video5: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiem5piy7oeqytidploabfvumnmnd4ck734txw5iv66l67uikugosi"
      }
    },
    ImmortalizedDocsNFT: {
      name: "Immortalized Documentations NFT",
      supply: "TBD editions",
      price: "TBD",
      coverImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiasdtelvp3xcxiv5ourudvfpe3aaladtcdrzo362d57i7umtczpzm",
      metadata: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeifbx5p5xprjqrw5d34vw5bytl77e32lmbgpxp6kbefwsorkydyruy",
      ipfsAssets: {
        centerImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiecrmlomahdc3r2ev3yl4xbveorrtumst7efksmjwpne5fv2elgya",
        documentPDF: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiguxvhuvusvxvu3e2odh7jroactk4lfykxjatd2mnq3dkdgepd64a",
        video1: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeihzsnenlkgaxdpavl6umt4zdu2rinfkb7fkjaj7rqmq44nxxo5heq",
        video2: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeibtaruka37x6ttuzgjlnnmlcearrnjj2vfn3igltivgaiuufw4xfi",
        video3: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidsnwlsmtyh2qvu3wl5xdv3bt5nzhbcbhpi6bwzsyudcxez6lywbe",
        video4: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeibf6uux73vflcppkymtplsaje7qefjvahwnztaufgku3vh7lrj2vm",
        video5: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiesryrxdb5i6amey6qqaus6pqbyah6od4q5ryykd44ymaiuriy2vu"
      }
    },
    HybridCoinNFT: {
      name: "Hybrid Coin NFT",
      supply: "TBD editions",
      price: "TBD",
      coverImage: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeigufnyrawyjgboptho57hkgkd2gciq2n6ydfweahfjxs7cazelyjq",
      metadata: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeifbx5p5xprjqrw5d34vw5bytl77e32lmbgpxp6kbefwsorkydyruy",
      ipfsAssets: {
        logo2: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiazfchcvljrvmxm6qy6citcklxnpr2v3ts7zqdriu2bit5m6ez4v4",
        video1: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeidjdgmng55zwny7gztf4zxkawjfwxnmtuewd7u4ea24wxqnqlqa3u",
        video2: "https://copper-active-hawk-266.mypinata.cloud/ipfs/bafybeiabw5nfkclrevkq5rvlm3dpe7smw4hjxgbaflr3zbognqao3x4j6a"
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
          🚀 Deployment Dashboard
        </h1>
        <p className="text-xl text-gray-300">Deploy and manage smart contracts with MetaMask</p>
      </div>

      {/* Contract Selection Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(contracts).map(([key, contract]) => (
          <div
            key={key}
            onClick={() => setSelectedContract(key)}
            className={`cursor-pointer bg-white/5 backdrop-blur-xl rounded-2xl p-6 border transition-all hover:scale-105 ${
              selectedContract === key ? 'border-blue-500 ring-2 ring-blue-500' : 'border-white/10'
            }`}
          >
            <img
              src={contract.coverImage}
              alt={contract.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{contract.name}</h3>
            <div className="text-sm text-gray-400 mb-2">{contract.supply}</div>
            <div className="text-lg font-bold text-green-400">{contract.price}</div>
            <div className="mt-4 text-xs text-gray-500">
              {Object.keys(contract.ipfsAssets).length} IPFS Assets
            </div>
          </div>
        ))}
      </div>

      {/* Selected Contract Details */}
      {selectedContract && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
          <h2 className="text-3xl font-bold mb-6">Deploy {contracts[selectedContract].name}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Owner Address</label>
                  <input
                    type="text"
                    defaultValue="0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Base URI (IPFS)</label>
                  <input
                    type="text"
                    defaultValue={contracts[selectedContract].metadata}
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Treasury Address</label>
                  <input
                    type="text"
                    defaultValue="0x67BF9f428d92704C3Db3a08dC05Bc941A8647866"
                    className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 font-mono text-sm"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleDeploy}
                disabled={deploying || !walletConnected}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-lg font-bold mt-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deploying ? 'Deploying...' : walletConnected ? 'Deploy with MetaMask' : 'Connect Wallet First'}
              </button>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">IPFS Assets</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(contracts[selectedContract].ipfsAssets).map(([key, url]) => (
                  <div key={key} className="bg-black/30 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-xs text-gray-400 font-mono">{url.substring(0, 40)}...</div>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployed Contracts Status */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h3 className="text-2xl font-bold mb-4 text-blue-400">📋 Contract Status</h3>
        <div className="space-y-3">
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">TRUTH Token</span>
              <span className="text-green-400">✅ Deployed</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">0x8f6c...30a3c</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Creator Token</span>
              <span className="text-green-400">✅ Deployed</span>
            </div>
            <div className="text-xs text-gray-400 font-mono">0x22b0...5aa7</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deploy;
