
# Automating Google Shopping Data Feed Updates Using Google Apps Script

Google Shopping has become an essential advertising tool in e-commerce. However, keeping product listings updated regularly can be a hassle.

In this article, I'll explain how to use Google Sheets to scrape product data from your e-commerce website and automatically update your product feed in Google Merchant Center periodically.

## Overview
1. Register the product feed in Google Merchant Center.
2. Modify the Google Sheet.
3. Scrape product data to create the data feed.
4. Schedule the scraping process.

## Registering the Feed in Google Merchant Center
First, register the product feed in [Google Merchant Center](https://www.google.com/retail/solutions/merchant-center/). From the left menu, select "Products" → "Feeds," then click the "+" button on the right to add a new feed.

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/88499437-5331-5e54-dc3f-0a871b2d1650.png)

After entering your address and other information, provide a feed name and select "Google Sheets" as the feed type.

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/b82ef5ea-9fb4-3bda-f667-525103bc73f2.png)

Next, select "Create a new Google Sheets spreadsheet" and specify the update frequency. While there is no strict rule, setting it to update daily in the morning is recommended (delaying the update slightly avoids conflicts with scraping schedules).

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/bf76d5dc-c574-8d34-0007-07d5f97bae55.png)

This will create a new Google Sheets file.

## Modifying the Google Sheet
Open the newly created Google Sheets file. Paste the product page URLs into column D ("link") of the "Sheet1" tab.

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/795c4286-2aeb-53ee-94bf-ade215c74344.png)

Next, create a new sheet called "log." Add "Date" and "Latest Row" in the first row, and enter "2" in cell B2.

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/3a47d5e3-b7f1-ef65-8f0d-34f5e03db172.png)

## Scraping Product Data to Create the Data Feed
Now, we'll scrape product data from your website to populate the Google Sheets file. Google Merchant Center requires the following product data:

- **id**: Unique product ID (e.g., SKU)
- **title**: Product name
- **description**: Product description
- **link**: Product page URL
- **condition**: One of "new" (new), "used" (used), or "refurbished" (refurbished)
- **price**: Product price
- **availability**: Stock status ("in stock," "out of stock," "preorder")
- **image_link**: Main product image URL
- **gtin**: Global Trade Item Number (optional)
- **mpn**: Manufacturer Part Number (optional)
- **brand**: Brand name
- **google_product_category**: Google-defined product category (optional)

### Specifying Data Location Using JS Path
To scrape specific data (e.g., price, product name) from a webpage, you must identify its location. In Chrome, right-click the desired element (e.g., product name) and select "Inspect."

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/acc64cf6-07b0-0e17-bb99-aff555de80ab.png)

Right-click the highlighted element in the Elements tab, select "Copy" → "Copy JS path," and paste it into a text editor. For example, it might look like `document.querySelector(".maincontent > div > div.page-title-wrapper.product > h1 > span")`. Use the unique part of the path that avoids conflicts with other elements (e.g., "h1 > span").

### Writing the Scraping Script in Google Apps Script
Now, we'll create the script to scrape the data. Open the script editor by navigating to "Extensions" → "Apps Script" in Google Sheets.

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/8bf69096-fa0a-597b-fe03-9c1d3336deb4.png)

Replace the default function with the following code:

```javascript
// Add your JavaScript code here
```

## Automating Scraping with Triggers
To automate the scraping process, set up a trigger to run the script periodically. Go to "Triggers" → "Add Trigger" and set the main function to execute hourly or at specific intervals.

![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3939399/fef8da73-6cd9-53b5-1d8a-01f32f07103e.png)

## Conclusion
This guide demonstrates how to scrape product data from your e-commerce website and update your Google Shopping data feed using Google Apps Script. While Apps Script might not be widely known, its seamless integration with Google services like Sheets, Gmail, and Analytics makes it incredibly powerful for automation.
