# Command

```
list <plant_name>
```
Returns a csv file. The columns are:
- Name
- Smile
- InChIKey
- Exact Mass
Each line is a compound returned by the lotus api for the input plant name

# Debug
```
DEBUG=substance* node list.js <plant_name>
```
Will output on stderr debug logs.


# Steps Overview
1. query Lotus API
Input: plant name
Output: list of compounds (important property: InChIKey)

2. Query PubChem API
Input: List of InChIKeys
Output: List of exact masses

3. Write results in a csv file

# Query PubChem
Batch by 60 Inchikeys so that the request URL does not overflow the 2048 character limit.