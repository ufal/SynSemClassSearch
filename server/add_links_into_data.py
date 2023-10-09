import pymongo
from pymongo import MongoClient
import requests
import sys 
from tqdm import tqdm
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_links(lexidrefs, lang):
    API_URL = 'https://10.10.51.118:3000/api/batch-links'
    response = requests.post(API_URL, json={'idrefs': lexidrefs, 'lang': lang}, verify=False)
    
    print("Response Status:", response.status_code)
    print("Response Content:", response.content)
    
    return response.json() 


# Establish a connection to the MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/synsemclass")
db = client.synsemclass
print("DB names in MongoDB:", client.list_database_names())

collections = ['czechlangmembers']  
lang = 'ces' 

for collection in tqdm(collections):
    coll = db[collection]
    
    for doc in coll.find({}):
        try:
            classmembers = doc['classmembers']['classmember']
        except TypeError:
            # print(f"Problematic doc: {doc}")
            continue 

        # classmembers = doc['classmembers']['classmember']
        if isinstance(classmembers, dict):
            # Handle case when there's only one classmember and it's not in a list
            classmembers = [classmembers]
        
        lexidrefs = [classmember['@lexidref'] for classmember in classmembers]
        links = get_links(lexidrefs, lang)

        for classmember in classmembers:
            lexidref = classmember['@lexidref']
            if lexidref in links:
                classmember['lexlink'] = links[lexidref]
        
        doc['classmembers']['classmember'] = classmembers
        # Update the document in the MongoDB
        coll.update_one({'_id': doc['_id']}, {'$set': doc})
        updated_doc = coll.find_one({'_id': doc['_id']})
        # print("Updated doc:", updated_doc)
