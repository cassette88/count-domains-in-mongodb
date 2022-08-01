import { MongoClient }  from 'mongodb';
import { parseDomain, fromUrl } from "parse-domain";

// enter your mongo connection string below
const uri = "<connection string uri>"

// initial connection 
const client = new MongoClient(uri);

async function run(){

    try{

        // swap your database and collection names in for "space" and "nasa"
        const db = client.db("space")
        const feeds = db.collection("nasa")

        // pull documents from mongo
        const cursor = feeds.find({});
        const allValues = await cursor.toArray();
    
        // count the link frequency with reduce
        // note if the key in your mongo document's object is named something other than link
        // then change cur.link to cur.url or whatever field name contains the urls 
        const site =  allValues.reduce((acc, cur) => {

            let link = cur.link
            const { domain, topLevelDomains } = parseDomain (fromUrl(link))
            
            let tld = `${domain}.${topLevelDomains}`

            acc[tld] = (acc[tld] || 0) + 1
            return acc
         }, {})

        console.log(site)

    } catch(err){
        console.log(err)
    }


}

run()