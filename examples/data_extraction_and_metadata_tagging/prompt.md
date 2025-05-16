# Data Extraction and Metadata Tagging Prompt

You are a data transformation specialist. Your task is to analyze the following data file and:

1. Extract these key fields from each record:
   - Customer ID
   - Purchase date
   - Total purchase value
   - Product categories purchased

2. Tag each record with:
   - Customer spending tier: "Low" (<$50), "Medium" ($50-$150), "High" (>$150)
   - Purchase frequency: "First-time" (only 1 transaction), "Returning" (2-5 transactions), "Loyal" (>5 transactions)
   - Season of purchase: "Winter", "Spring", "Summer", "Fall"

3. Format the output as JSON with the following structure:
   {
     "customer_data": [
       {
         "customer_id": "...",
         "extracted_data": {
           "total_spent": X.XX,
           "purchase_date": "YYYY-MM-DD",
           "categories": ["category1", "category2"]
         },
         "metadata_tags": {
           "spending_tier": "...",
           "frequency": "...",
           "season": "..."
         }
       },
       ...
     ],
     "summary_stats": {
       "avg_purchase_value": X.XX,
       "most_common_category": "...",
       "customers_by_tier": {
         "Low": X,
         "Medium": X,
         "High": X
       }
     }
   }

Analyze the data thoroughly and ensure all required fields are extracted. If any information is missing, mark it as "unknown" rather than omitting it.