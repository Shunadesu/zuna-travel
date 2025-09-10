const mongoose = require('mongoose');
const Transfer = require('../models/Transfer');

const updateTransfersFeatured = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-travel');
    console.log('Connected to MongoDB');

    // Get all transfers
    const transfers = await Transfer.find({});
    console.log(`Found ${transfers.length} transfers`);

    if (transfers.length === 0) {
      console.log('No transfers found. Please create some transfers first.');
      return;
    }

    // Update first 3 transfers to be featured
    const transfersToUpdate = transfers.slice(0, 3);
    
    for (const transfer of transfersToUpdate) {
      await Transfer.findByIdAndUpdate(transfer._id, { isFeatured: true });
      console.log(`Updated transfer: ${transfer.title?.en || transfer.title?.vi || 'Unknown'} to featured`);
    }

    // Update remaining transfers to not be featured
    const remainingTransfers = transfers.slice(3);
    for (const transfer of remainingTransfers) {
      await Transfer.findByIdAndUpdate(transfer._id, { isFeatured: false });
    }

    console.log('Transfer featured status updated successfully!');
    
    // Show final status
    const featuredTransfers = await Transfer.find({ isFeatured: true });
    console.log(`Total featured transfers: ${featuredTransfers.length}`);
    
    featuredTransfers.forEach(transfer => {
      console.log(`- ${transfer.title?.en || transfer.title?.vi || 'Unknown'} (${transfer.slug})`);
    });

  } catch (error) {
    console.error('Error updating transfers featured status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
if (require.main === module) {
  updateTransfersFeatured();
}

module.exports = updateTransfersFeatured;
