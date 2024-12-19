const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const unidecode = require('unidecode');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

const path = require("path");
const https = require('https');
const fs = require('fs');
const cors = require('cors');

require('dotenv').config();

app.use(cors());

const BASE_PATH = process.env.BASE_PATH || '/';
const isProduction = process.env.NODE_ENV === 'production';
const isQuest = process.env.QUEST === 'TRUE'; // on quest HTTPS is used...
const isLocal = process.env.IS_LOCAL === 'TRUE';

const getEnvVariable = (prodValue, devValue) => isProduction ? prodValue : devValue;

// Database configuration
const _DB_NAME = getEnvVariable("synsemclass", "mydb");

mongoose.set('strictQuery', true);
// mongoose.connect(`mongodb://127.0.0.1:27017/${_DB_NAME}`, {useNewUrlParser: true}); //synsemclass

const dbConnection1 = mongoose.createConnection(`mongodb://127.0.0.1:27017/${_DB_NAME}`, { useNewUrlParser: true});
const dbConnection2 = mongoose.createConnection(`mongodb://127.0.0.1:27017/${_DB_NAME}5`, { useNewUrlParser: true});
const dbConnection3 = mongoose.createConnection(`mongodb://127.0.0.1:27017/${_DB_NAME}51`, { useNewUrlParser: true});

dbConnection1.once('open', () => {
    console.log('MongoDB database connection established successfully for synsemclass4.0');
});

dbConnection2.once('open', () => {
    console.log('MongoDB database connection established successfully  for synsemclass5.0');
});

dbConnection3.once('open', () => {
    console.log('MongoDB database connection established successfully  for synsemclass5.1');
});

const classMemberSchema = {
    "@id": String,
    "@lemma": String,
    "class_definition": String,
    "classmembers": {
        "classmember": [{
            "@id": String,
            "@idref": String,
            "@lang": String,
            "@status": String,
            "@lexidref": String,
            "@lemma": String,
            "maparg": String,
            "restrict": String, 
            "cmnote": String,
            "extlex": Array,
            "examples": String
        }]
    },
    };

    // {
    //     "_id" : ObjectId("643ebdecd08536c89d0501fd"),
    //     "@id" : "vecroleAbandoned",
    //     "comesfrom" : {
    //         "@lexicon" : "synsemclass"
    //     },
    //     "label" : "Sb/sth deserted or left swh.",
    //     "shortlabel" : "Abandoned"
    // }

const rolesSchema = {
    "@id": String,
    "comesfrom": Array,
    "label": String,
    "shortlabel": String
    };

    // {
    //     "_id" : ObjectId("643ebdfbdb06e25469072319"),
    //     "@id" : "vec00002",
    //     "@status" : "finished",
    //     "class_definition" : "A Cognizer expects a Phenomenon that comes from a Source.",
    //     "commonroles" : {
    //         "role" : [
    //             {
    //                 "@idref" : "vecroleCognizer",
    //                 "@spec" : ""
    //             },
    //             {
    //                 "@idref" : "vecrolePhenomenon",
    //                 "@spec" : ""
    //             },
    //             {
    //                 "@idref" : "vecroleSource",
    //                 "@spec" : ""
    //             }
    //         ]
    //     },
    //     "classnote" : null
    // }

const veclass_rolesSchema = {
    "@id" : String,
    "@status" : String,
    "class_definition" : String,
    "commonroles" : {
        "role" : [
            {
                "@idref" : String,
                "@spec" : String
            },
            {
                "@idref" : String,
                "@spec" : String
            },
            {
                "@idref" : String,
                "@spec" : String
            }
        ]
    },
    "classnote" : String
}

const linksSchema = {
    "@id" : String,
    "@name" : String,
    "lexref" : String,
    "lexbrowsing" : String,
    "lexsearching" : String,
    "argumentsused" : {
        "argdesc" : Array
    }
}

// const ClassMember = mongoose.model("classmember", classMemberSchema);
// SynSemClass4.0 collections:
const ClassMember = dbConnection1.model("englishlangmember", classMemberSchema);
const ClassMemberCz = dbConnection1.model("czechlangmember", classMemberSchema);
const ClassMemberDeu = dbConnection1.model("germanlangmember", classMemberSchema);

const Roles = dbConnection1.model("role", rolesSchema);
const Veclass_Roles = dbConnection1.model("veclass_role", veclass_rolesSchema);

const Links_eng = dbConnection1.model("eng_reflexicon", linksSchema);
const Links_ces = dbConnection1.model("ces_reflexicon", linksSchema);
const Links_deu = dbConnection1.model("deu_reflexicon", linksSchema);

// SynSemClass5.0 collections:
const ClassMember5 = dbConnection2.model("englishlangmember", classMemberSchema);
const ClassMemberCz5 = dbConnection2.model("czechlangmember", classMemberSchema);
const ClassMemberDeu5 = dbConnection2.model("germanlangmember", classMemberSchema);
const ClassMemberSpa5 = dbConnection2.model("spanishlangmember", classMemberSchema);

const Roles5 = dbConnection2.model("role", rolesSchema);
const Veclass_Roles5 = dbConnection2.model("veclass_role", veclass_rolesSchema);

const Links_eng5 = dbConnection2.model("eng_reflexicon", linksSchema);
const Links_ces5 = dbConnection2.model("ces_reflexicon", linksSchema);
const Links_deu5 = dbConnection2.model("deu_reflexicon", linksSchema);
const Links_spa5 = dbConnection2.model("spa_reflexicon", linksSchema);

// SynSemClass5.1 collections:
const ClassMember51 = dbConnection3.model("englishlangmember", classMemberSchema);
const ClassMemberCz51 = dbConnection3.model("czechlangmember", classMemberSchema);
const ClassMemberDeu51 = dbConnection3.model("germanlangmember", classMemberSchema);
const ClassMemberSpa51 = dbConnection3.model("spanishlangmember", classMemberSchema);

const Roles51 = dbConnection3.model("role", rolesSchema);
const Veclass_Roles51 = dbConnection3.model("veclass_role", veclass_rolesSchema);

const Links_eng51 = dbConnection3.model("eng_reflexicon", linksSchema);
const Links_ces51 = dbConnection3.model("ces_reflexicon", linksSchema);
const Links_deu51 = dbConnection3.model("deu_reflexicon", linksSchema);
const Links_spa51 = dbConnection3.model("spa_reflexicon", linksSchema);

// Deprecated functions; no need since the database was updated to contain the roles
const findRoleIdsByShortLabel = async (roles) => {
    const roleIds = await Roles.find({ shortlabel: { $in: roles } }).select("@id");
    return roleIds.map((role) => role["@id"]);
};

const findVeclassIdsByRoleIds = async (roleIds, roleOperators) => {
    let veclassIds;

    const statusNotMergedOrDeleted = {
        "@status": { $nin: ["merged", "deleted"] },
    };

    if (roleOperators === "AND") {
        const matchQuery = [
        {
            $match: {
            ...statusNotMergedOrDeleted,
            },
        },
        {
            $addFields: {
            processedRoles: {
                $cond: [
                { $isArray: "$commonroles.role" },
                "$commonroles.role",
                [{ $ifNull: ["$commonroles.role", []] }],
                ],
            },
            },
        },
        {
            $addFields: {
            matchingRoles: {
                $filter: {
                input: "$processedRoles",
                as: "role",
                cond: { $in: ["$$role.@idref", roleIds] },
                },
            },
            },
        },
        {
            $match: {
            matchingRoles: { $size: roleIds.length },
            },
        },
        ];

        veclassIds = await Veclass_Roles.aggregate(matchQuery).exec();
    } else {
        veclassIds = await Veclass_Roles.find({
        "commonroles.role.@idref": { $in: roleIds },
        ...statusNotMergedOrDeleted,
        }).select("@id");
    }

    return veclassIds.map((veclass) => veclass["@id"] || veclass["_id"]);
};

// Main query search function that combines all search options together
const findDocuments = async (input, idRef, classID, cmnote, restrict, clauses, restrictRolesSearch, diacriticsSensitive, collection, version) => {
    // Retrieve the list of valid Veclass_Roles documents that have their @status NOT in ["merged", "deleted"].
    let VRoles;

    switch (version) {
        case "synsemclass5.1":
            VRoles = Veclass_Roles51;
            break;
        case "synsemclass5.0":
            VRoles = Veclass_Roles5;
            break;
        case "synsemclass4.0":
            VRoles = Veclass_Roles;
	    break;
    }
    console.log("version", version)
    const validVeclassIds = (await VRoles.find({ "@status": { $nin: ["merged", "deleted"] } }).select("@id")).map(veclass => veclass["@id"]);

    const query = [
        { $unwind: "$classmembers.classmember" },
        {
        $match: {
            "classmembers.classmember.@status": { $in: ["yes", "rather_yes"] },
            "@id": { $in: validVeclassIds },
        },
        },
        // { $addFields: {
        //         "classmembers.classmember.common_id": "$@id",
        //         "classmembers.classmember.common_class": "$@lemma",
        //     }
        // }, 
        // other match conditions here
        {
        $group: {
            _id: "$@id",
            classMembers: { $push: "$classmembers.classmember" },
            commonClass: { $first: "$@lemma" },
            commonClassDefinition: { $first: "$class_definition" },
            roles: { $first: "$@roles" }
        },
        },
        {
        $project: {
            _id: 0,
            commonID: "$_id",
            commonClass: 1,
            commonClassDefinition: 1,
            classMembers: 1,
            roles: 1,
        },
        },
    ];


    const matchConditions = [
        { "@id": { $in: validVeclassIds } },
    ];

    if (input) {
        const normalizedInput = diacriticsSensitive ? input : unidecode(input);
        const inputRegex = new RegExp(`^${normalizedInput}$`, "iu");
    
        if (diacriticsSensitive) {
            // Diacritics-sensitive search: use the @lemma field
            matchConditions.push({ "classmembers.classmember.@lemma": { $regex: inputRegex } });
        } else {
            // Diacritics-insensitive search: use the normalized_lemma field
            matchConditions.push({ "classmembers.classmember.normalized_lemma": { $regex: inputRegex } });
        }
    }

    if (idRef) {
        const idRefRegex = new RegExp(`^${idRef}$`, "iu");
        matchConditions.push({ "classmembers.classmember.@idref": idRefRegex });
    }

    if (classID) {
        const classIDRegex = new RegExp(`^${classID}$`, "iu");
        matchConditions.push({ "@id": classIDRegex });
    }

    if (cmnote) {
        console.log("Processing cmnote...", cmnote)
        const cmnoteRegex = new RegExp(`^${cmnote}$`, "iu");
        matchConditions.push({ "classmembers.classmember.cmnote": cmnoteRegex });
    }

    if (restrict) {
        const restrictRegex = new RegExp(`^${restrict}$`, "iu");
        matchConditions.push({ "classmembers.classmember.restrict": restrictRegex });
    }

    // if (clauses) {
    //     const clauseConditions = clauses.map(clause => {
    //         const clauseCondition = clause.map(role => ({ 'classmembers.classmember.maparg.argpair.argto.@idref': `vecrole${role}` }));
    //         return { $or: clauseCondition };
    //     });

    //     matchConditions.push({ $and: clauseConditions });
    // }


    if (clauses) {
        const clauseConditions = clauses.map(clause => {
            const clauseCondition = clause.map(role => ({ '@roles': role }));
            return { $or: clauseCondition };
        });
    
        if (restrictRolesSearch) {
            console.log("restrictRolesSearch set to", restrictRolesSearch);
            // When restricting the search, ensure that the document has only the specified roles
            matchConditions.push({ 
                $and: [
                    { $and: clauseConditions },
                    { '@roles': { $size: clauses.flat().length } }
                ]
            });
        } else {
            // Unrestricted search
            matchConditions.push({ $and: clauseConditions });
        }
    }
    

    if (matchConditions.length > 0) {
        query.splice(1, 0, { $match: { $and: matchConditions } });
    }

    query.splice(1, 0, {
        $match: { "classmembers.classmember.@status": { $in: ["yes", "rather_yes"] } },
        });
        

    // return ClassMember.aggregate(query);
    return collection.aggregate(query).then(docs => {
        // Extract the common_class values and common_id values from the docs
        // console.log("CHECK:", docs)

        const commonClasses = docs.map(doc => doc.commonClass);
        const commonIds = docs.map(doc => doc.commonID);
    
        // Return the docs (results), common_class values, and common_id values
        return { docs, commonClasses, commonIds };
    });
    
};

/// get shortlabels roles
const getAllShortLabels = async (roles_collection) => {

    return roles_collection.find({}, { shortlabel: 1, _id: 0 }).lean();
};

// Set up routes
const router = express.Router();

// Serve static files from the React app
app.use(BASE_PATH, express.static(path.join(__dirname, '..', 'client', 'build')));

/// request to get roles list
router.get('/api/shortlabels', async (req, res) => {
    try {
        const version = req.body.version;
	
	let roles_collection;
        switch (version) {
            case "synsemclass5.1":
                roles_collection = Roles51;
                break;
            case "synsemclass5.0":
                roles_collection = Roles5;
                break;
            case "synsemclass4.0":
                roles_collection = Roles;
		break;
       }
        
	const shortLabels = await getAllShortLabels(roles_collection);
        if (!shortLabels.length) {
            return res.status(404).json({ error: 'No short labels found.' });
        }
        res.json(shortLabels.map((item) => item.shortlabel));
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'An error occured while fetching short labels.' });
    }
})

router.post('/api/batch-links', async (req, res) => {
    const idrefs = req.body.idrefs;
    const lang = req.body.lang;
    const version = req.body.version;

    if (!idrefs || !lang || !version) {
        return res.status(400).json({ error: 'Invalid input data.' });
    }
    
    let Model;
    switch (version) {
        case "synsemclass4.0":
            switch (lang) {
                case "eng":
                    Model = Links_eng;
                    break;
                case "ces":
                    Model = Links_ces;
                    break;
                case "deu":
                    Model = Links_deu;
                    break;
            }
            break;
        case "synsemclass5.0":
            switch (lang) {
                case "eng":
                    Model = Links_eng5;
                    break;
                case "ces":
                    Model = Links_ces5;
                    break;
                case "deu":
                    Model = Links_deu5;
                    break;
                case "spa":
                    Model = Links_spa5;
                    break;
            }
            break;
        case "synsemclass5.1":
            switch (lang) {
                case "eng":
                    Model = Links_eng51;
                    break;
                case "ces":
                    Model = Links_ces51;
                    break;
                case "deu":
                    Model = Links_deu51;
                    break;
                case "spa":
                    Model = Links_spa51;
                    break;
            }
            break;
    }

    
    if (Model) {
        const data = await Model.find({"@id": { $in: idrefs }});
        const links = {};
        for (const item of data) {
            console.log("@ID inside links", item["@id"])
            links[item["@id"]] = item["lexbrowsing"];
            if (item["@id"] == "engvallex") {
                links[item["@id"]] = "https://lindat.mff.cuni.cz/services/EngVallex20/EngVallex20.html?"
            }
        }
        res.json(links);
    } else {
        res.status(400).json({ error: "Invalid language" });
    }
});

//main API GET route
router.get("/api/search", function (req, res) {
    console.log("QUERY", req.query);

    const version = req.query.version || 'synsemclass5.1';
    const restrictRolesSearch = req.query.restrictRolesSearch === 'true';
    const diacriticsSensitive = req.query.diacriticsSensitive === 'true';

    const query = req.query.lemma;
    const idRef = req.query.idRef;
    const classID = req.query.classID;
    const filters = req.query.filters ? req.query.filters.split(",") : [];

    const cmnote = req.query.cmnote;
    const restrict = req.query.restrict;

    const allResults = req.query.allResults === 'true';

    // let clauses = req.query.roles_cnf ? JSON.parse(req.query.roles_cnf) : false;
    // if (Array.isArray(clauses) && clauses.length === 0) {
    // clauses = false;
    // }

    let clauses = false;

    try {
        if (req.query.roles_cnf) {
            console.log(req.query.roles_cnf)
            // Sanitize the input string
            let sanitizedInput = req.query.roles_cnf.trim().replace(/'/g, '"');
            
            // Try to parse the JSON
            clauses = JSON.parse(sanitizedInput);
            
            // Validate that it is an array of arrays
            if (!Array.isArray(clauses) || !clauses.every(subArray => Array.isArray(subArray))) {
                throw new Error("Input should be an array of arrays");
            }

            // Check for an empty array
            if (clauses.length === 0) {
                clauses = false;
            }

            // Additional sanitation: Ensure names are properly capitalized
            if (clauses) {
                clauses = clauses.map(subArray =>
                    subArray.map(name =>
                        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
                    )
                );
            }
        }
    } catch (error) {
        // Log error internally
        console.error(error);
        
        // Inform client of bad request
        return res.status(400).json({
            error: "Bad Request",
            message: "The 'roles_cnf' parameter should be a JSON string representing a non-empty array of arrays."
        });
    }

    console.log("Parsed query:")
    console.log("clauses", clauses);
    console.log("query:", query);
    console.log("idRef:", idRef);
    console.log("classID:", classID);
    console.log("filters:", filters);
    console.log("selected version:", version);
    console.log("restrictRolesSearch:", restrictRolesSearch);
    console.log("cmnote:", cmnote);
    console.log("restrict:", restrict);
    console.log("diacritics sensitive search:", diacriticsSensitive);

    if (!query && !idRef && !classID && !cmnote && !restrict && filters.length === 0 && clauses.length === 0) {
        return res.json([]);
    }

    const collections_v4 = {
        eng: ClassMember,
        cz: ClassMemberCz,
        deu: ClassMemberDeu
    };
    
    const collections_v5 = {
        eng: ClassMember5,
        cz: ClassMemberCz5,
        deu: ClassMemberDeu5,
        spa: ClassMemberSpa5
    };
    
    const collections_v51 = {
        eng: ClassMember51,
        cz: ClassMemberCz51,
        deu: ClassMemberDeu51,
        spa: ClassMemberSpa51
    };
    
    let collections;
    switch (version){
        case 'synsemclass4.0':
   	    collections = collections_v4;
            break;
        case 'synsemclass5.0':
            collections = collections_v5;
            break;
        case 'synsemclass5.1':
            collections = collections_v51;
            break;
    }
    
    const searchFunctions = [];
    
    for (const filterValue of filters) {
        if (collections[filterValue]) {
            searchFunctions.push(() => findDocuments(query, idRef, classID, cmnote, restrict, clauses, restrictRolesSearch, diacriticsSensitive, collections[filterValue], version)
            .then(result => ({...result, language: filterValue}))); 
        }
    }
    
    if (filters.length === 0) {
        Object.keys(collections).forEach(language => {
            searchFunctions.push(() => findDocuments(query, idRef, classID, cmnote, restrict, clauses, restrictRolesSearch, diacriticsSensitive, collections[language], version)
            .then(result => ({...result, language})));  
        });
    }

    Promise.all(searchFunctions.map((searchFn) => searchFn()))
    .then((results) => {
        // Initialize an object to hold counts for each language
        const langCounts = {};

        // Extract all results and all common_class arrays and all common_id arrays
        const mergedResults = [];
        const allCommonClasses = [];
        const allCommonIds = [];
        results.forEach(result => {
            mergedResults.push(...result.docs);
            allCommonClasses.push(...result.commonClasses);
            allCommonIds.push(...result.commonIds);

            // Update the counts for the language
            const language = result.language;
            if (!langCounts[language]) {
                langCounts[language] = {
                    classMembers: 0,
                    commonClasses: 0
                };
            }

            // Count class members
            result.docs.forEach(doc => {
                langCounts[language].classMembers += doc.classMembers.length;
            });
            langCounts[language].commonClasses += new Set(result.commonClasses).size;
        });

        // Group documents by @id
        const groupedResults = mergedResults.reduce((grouped, document) => {
            const id = document.commonID;
            if (grouped[id]) {
                // Extend existing group
                grouped[id].push(document);
            } else {
                // Create new group
                grouped[id] = [document];
            }
            return grouped;
        }, {});

        const sortedArray = Object.entries(groupedResults)
            .sort((a, b) => {
                // Extract the numbers from the IDs
                const numA = parseInt(a[0].match(/\d+/));
                const numB = parseInt(b[0].match(/\d+/));

                // Compare the numbers
                return numA - numB;
            });
                
        const sortedResults = Object.fromEntries(sortedArray);
    
        // Count unique common_class entries and common_id entries
        const uniqueCommonClassCount = new Set(allCommonClasses).size;
        const uniqueCommonIdCount = new Set(allCommonIds).size;

        // Total class members count
        const totalClassMembers = Object.values(langCounts).reduce((total, current) => total + current.classMembers, 0);

        // console.log("API result", sortedResults);

        console.log(`Found ${totalClassMembers} classmembers.`);
        console.log(`Found ${uniqueCommonClassCount} common classes.`);
        console.log(`Found ${uniqueCommonIdCount} unique classes based on '@id'.`);

        // console.log("API RESULT", groupedResults);
        if (allResults) {
            console.log(">>>Sent .json data without pagination for further downloading.")
            res.json(sortedResults);
        } else {
            console.log(">>>Applied pagination on server-side.")
            // Calculate the total number of pages
            const pageSize = 5; // Replace with your desired page size
            const totalPageCount = Math.ceil(sortedArray.length / pageSize);

            // Pre-calculate the page slices
            const slices = [];
            for (let i = 0; i < totalPageCount; i++) {
            const slicedEntries = sortedArray.slice(i * pageSize, (i + 1) * pageSize);
            const slicedResults = Object.fromEntries(slicedEntries);
                slices.push(slicedResults);
            }

            // Send the response back to the client
            res.json({ pages: slices, uniqueCommonClassCount, uniqueCommonIdCount, langCounts, totalClassMembers });
        }})
    .catch((err) => {
        // Handle any errors
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    });



    
    });
    
    
let common_components_path = (isLocal || isQuest) ? '' : '/';
// Include lindat-common header and footer
app.get(`${BASE_PATH}${common_components_path}header`, (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'client', 'public', 'lindat-common', 'header.htm'), 'utf8', (err, data) => {
        if (err) {
        res.status(500).send('An error occurred while reading the header file.');
        } else {
        res.send(data);
        }
    });
});

app.get(`${BASE_PATH}${common_components_path}footer`, (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'client', 'public', 'lindat-common', 'footer.htm'), 'utf8', (err, data) => {
        if (err) {
        res.status(500).send('An error occurred while reading the footer file.');
        } else {
        res.send(data);
        }
    });
});

// Mount routes to the main application middleware stack
app.use(BASE_PATH, router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

// Catch all requests and serve the React app
app.get(`${BASE_PATH}*`, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 3000;

// Server configurations
let serverConfig = {
    httpsOptions: null,
    host: isLocal ? 'localhost' : '10.10.51.118', 
};

if (isQuest) {
    try {
        serverConfig.httpsOptions = {
            key: fs.readFileSync(path.join(__dirname, 'key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
        };

        https.createServer(serverConfig.httpsOptions, app).listen(port, serverConfig.host, () => {
            console.log(`HTTPS server started on ${serverConfig.host}:${port}`);
        });
    } catch (error) {
        console.error("Error reading SSL certificate or key:", error.message);
        process.exit(1); 
    }
} else {
    app.listen(port, serverConfig.host, () => {
        console.log(`HTTP server started on ${serverConfig.host}:${port}`);
    });
}


