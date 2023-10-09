import json
import xmltodict
import os
import argparse
from tqdm import tqdm

parser = argparse.ArgumentParser()
parser.add_argument("--lang", default="eng", type=str, help="Language to import.") # can be eng, ces, deu

args = parser.parse_args()

print(f"Reading and parsing xml file for synsemclass_{args.lang}_cms.xml...")
with open(f"synsemclass4.0/synsemclass_{args.lang}_cms.xml") as xml_file: ### /net/projects/SynSemClass/data/anotace/BEST/synsemclass.xml ##/net/projects/SynSemClass/data/anotace/synsemclass4.0/synsemclass_eng_cms.xml
    data_dict = xmltodict.parse(xml_file.read())
xml_file.close()
print("> done.\n")

top_level_key = list(data_dict.keys())[0]
print(top_level_key)
data_dict.update(data_dict.pop(top_level_key))

for key in data_dict.keys():
    print(key)

data_dict = {"header": data_dict["header"]}
data_dict.update(data_dict.pop("header"))

print('---------------------------')
for key in data_dict.keys():
    print(key)

data_dict = {"reflexicons": data_dict["reflexicons"]}
data_dict.update(data_dict.pop("reflexicons"))

print("Number of entries:")
print(len(list(data_dict["lexicon"])), "\n")

path = os.getcwd() + f"/REFLEXICONS_json_files_for_mongodb_{args.lang}/"
if not os.path.exists(path):
    os.makedirs(path)

print("Generating .json files...")
for i, el in enumerate(tqdm(data_dict["lexicon"])):
    json_data = json.dumps(el)
    with open(path + "data_"+str(i)+".json", "w") as json_file:
        json_file.write(json_data)
    json_file.close()
print("> done.")
