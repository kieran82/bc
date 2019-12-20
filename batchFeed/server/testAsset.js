'use strict';


     const mayPurchase = () => {
        
      let assetTemplate = {
          "AssetNumber": 1,
          "AssetId": "1001",
          "DocType":"Asset-Ledger",
          "Buyer": "Company-A",
          "Seller": "Company B",
          "BuyerAssetFund": 4500.50,
          "SellerAssetPrice": 4000.90,
          "SellerAssetFund" : 1000.00,
          "Comment": "NoComment",
          "TransactionCompletionDate": "01-12-2019",
          "RequestDate": "12-12-2019",
          "Reference": "2118"
      };

      let assetForSale = assetTemplate;

      if (purchase(assetForSale)) {
        console.log(JSON.stringify(assetForSale));
        
      }

      // console.log(assetForSale.AssetId);
      // console.log(JSON.stringify(assetForSale));
      
     };

     const purchase = (asset) => {

      if (asset.BuyerAssetFund >= asset.SellerAssetPrice) {
        asset.BuyerAssetFund -= asset.SellerAssetPrice;
        asset.SellerAssetFund += asset.SellerAssetPrice
        console.log(`This is the value of the Seller Fund €${asset.SellerAssetFund}`);
        
        return true;
      }

      console.log(`No Sale ==> Buyer Fund €${asset.BuyerAssetFund} does not match €${asset.SellerAssetPrice}`);

      return false;
     }

     mayPurchase();