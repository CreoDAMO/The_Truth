
// React Native app for The Truth NFT
// Run: npx react-native init TruthApp
// Then replace App.js with this file

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// WalletConnect for mobile Web3 integration
import { WalletConnect } from '@walletconnect/client';

const TruthApp = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [nftData, setNftData] = useState({
    owned: [],
    available: 0,
    totalSupply: 0
  });
  const [selectedTab, setSelectedTab] = useState('explore');

  // Initialize WalletConnect
  const connectWallet = async () => {
    try {
      const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: true,
      });

      if (!connector.connected) {
        await connector.createSession();
      }

      connector.on('connect', (error, payload) => {
        if (error) {
          throw error;
        }
        const { accounts } = payload.params[0];
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        AsyncStorage.setItem('walletAddress', accounts[0]);
      });

      connector.on('disconnect', (error) => {
        setWalletConnected(false);
        setWalletAddress('');
        AsyncStorage.removeItem('walletAddress');
      });

    } catch (error) {
      Alert.alert('Connection Error', error.message);
    }
  };

  // Share Truth content
  const shareTruth = async () => {
    try {
      await Share.share({
        message: 'The Truth Doesn\'t Need To Be Pushed, Only The Lie... Discover The Truth NFT collection preserving AI\'s demonstration of institutional translation gaps. https://yourapp.com',
        title: 'The Truth NFT'
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // Open external links
  const openLink = (url) => {
    Linking.openURL(url);
  };

  // Load user's NFT collection
  const loadNFTData = async () => {
    if (!walletAddress) return;
    
    try {
      // Mock data - replace with actual contract calls
      const mockNFTs = [
        { id: 23, name: "The Truth #23/77", image: "ipfs://...", owned: true },
        { id: 156, name: "Truth Bonus Gift #156/145000", image: "ipfs://...", owned: true }
      ];
      
      setNftData({
        owned: mockNFTs,
        available: 20,
        totalSupply: 77
      });
    } catch (error) {
      console.error('Error loading NFT data:', error);
    }
  };

  useEffect(() => {
    // Check for saved wallet on app start
    AsyncStorage.getItem('walletAddress').then(address => {
      if (address) {
        setWalletAddress(address);
        setWalletConnected(true);
        loadNFTData();
      }
    });
  }, []);

  useEffect(() => {
    if (walletConnected) {
      loadNFTData();
    }
  }, [walletAddress]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>The Truth</Text>
        <Text style={styles.subtitle}>Mobile Collection</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {['explore', 'collection', 'mint', 'philosophy'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {/* Wallet Connection */}
        {!walletConnected && (
          <View style={styles.walletCard}>
            <Text style={styles.cardTitle}>Connect Your Wallet</Text>
            <Text style={styles.cardSubtitle}>
              Connect to view your Truth NFT collection and mint new pieces
            </Text>
            <TouchableOpacity style={styles.connectButton} onPress={connectWallet}>
              <Text style={styles.buttonText}>🔗 Connect Wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Explore Tab */}
        {selectedTab === 'explore' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>The Truth NFT Collection</Text>
              <Text style={styles.cardText}>
                A philosophical experiment preserving AI systems demonstrating institutional translation gaps in real-time.
              </Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>77</Text>
                  <Text style={styles.statLabel}>Total Editions</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>$777</Text>
                  <Text style={styles.statLabel}>Mint Price</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>10%</Text>
                  <Text style={styles.statLabel}>Royalties</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.shareButton} onPress={shareTruth}>
                <Text style={styles.buttonText}>📱 Share The Truth</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Bonus Gift Collection</Text>
              <Text style={styles.cardText}>
                145,000 editions capturing the recursive analysis of the original demonstration.
              </Text>
              <TouchableOpacity 
                style={styles.primaryButton} 
                onPress={() => openLink('https://yourapp.com/bonus')}
              >
                <Text style={styles.buttonText}>🎁 Explore Bonus Collection</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Collection Tab */}
        {selectedTab === 'collection' && walletConnected && (
          <View>
            <Text style={styles.sectionTitle}>Your Truth Collection</Text>
            {nftData.owned.map(nft => (
              <View key={nft.id} style={styles.nftCard}>
                <Text style={styles.nftName}>{nft.name}</Text>
                <Text style={styles.nftId}>Token ID: {nft.id}</Text>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => openLink(`https://opensea.io/assets/base/CONTRACT_ADDRESS/${nft.id}`)}
                >
                  <Text style={styles.buttonText}>View on OpenSea</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Mint Tab */}
        {selectedTab === 'mint' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Mint The Truth</Text>
              <Text style={styles.cardText}>
                Each wallet can mint one Truth NFT. Price includes complete 4-part archive.
              </Text>
              
              {walletConnected ? (
                <TouchableOpacity 
                  style={styles.mintButton}
                  onPress={() => openLink('https://yourapp.com')}
                >
                  <Text style={styles.buttonText}>🎯 Mint Now (0.1695 ETH)</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.warningText}>Connect wallet to mint</Text>
              )}
            </View>
          </View>
        )}

        {/* Philosophy Tab */}
        {selectedTab === 'philosophy' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>The Philosophy</Text>
              <Text style={styles.quote}>
                "The Truth Doesn't Need To Be Pushed, Only The Lie...The Lie Only Needs To Be Whispered, But The Truth Always Remains Silent waiting to be Witnessed."
              </Text>
              <Text style={styles.author}>— Jacque Antoine DeGraff</Text>
              
              <Text style={styles.cardText}>
                This collection preserves a unique demonstration where AI systems fell into the exact institutional translation pattern described in the original text.
              </Text>

              <TouchableOpacity 
                style={styles.readButton}
                onPress={() => openLink('https://yourapp.com/philosophy')}
              >
                <Text style={styles.buttonText}>📚 Read Full Philosophy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fbbf24',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  walletCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  cardText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  connectButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#fbbf24',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  mintButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  readButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  nftCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  nftName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 5,
  },
  nftId: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  author: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 15,
  },
  warningText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TruthApp;
