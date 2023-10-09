import pymongo
from pymongo import MongoClient
import argparse
from tqdm import tqdm

parser = argparse.ArgumentParser()
parser.add_argument("--lang", default="eng", type=str, help="Language to use.") # can be eng, ces, deu
parser.add_argument("--ignore_lang", default=False, action="store_true", help="Process roles instead.")
parser.add_argument("--case", default="roles", type=str, help="Roles or veclass entries, synsemclass_main file.") # can be roles or veclass

args = parser.parse_args()

client = pymongo.MongoClient("mongodb://localhost:27017/synsemclass")
db = client.synsemclass

# Define collections
collection_1 = db['veclass_roles']

if args.lang == "eng":
    collection_2 = db.englishlangmembers
if args.lang == "ces":
    collection_2 = db.czechlangmembers
if args.lang == "deu":
    collection_2 = db.germanlangmembers

# Find all documents in the first collection
docs = collection_1.find({})

for doc in tqdm(docs):
    # Extract the roles
    if isinstance(doc['commonroles']['role'], list):
        roles = [role['@idref'][7:] for role in doc['commonroles']['role']]
    else:
        roles = [doc['commonroles']['role']['@idref'][7:]]

    print(roles)
    # Update the document in the second collection
    collection_2.update_one({"@id": doc["@id"]}, {"$set": {"@roles": roles}})