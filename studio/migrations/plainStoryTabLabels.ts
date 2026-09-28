import fs from 'node:fs'
import path from 'node:path'
import {isDeepStrictEqual} from 'node:util'
import {getCliClient} from 'sanity/cli'
import {richTextToPlainText} from '../../frontend/src/lib/richText'
process.loadEnvFile(path.resolve('../frontend/.env.local'))
const client=getCliClient({apiVersion:'2026-09-12'}).withConfig({useCdn:false,perspective:'raw',token:process.env.SANITY_API_WRITE_TOKEN})
async function run(){
 const docs=await client.fetch<any[]>('*[_type in ["bigbangShortStory","bigbangLongStory"] && defined(tabLabel)]')
 const plans=docs.map(doc=>({doc,value:doc.tabLabel.map((entry:any)=>({...entry,_type:'internationalizedArrayStringValue',value:richTextToPlainText(entry.value)}))})).filter(p=>!isDeepStrictEqual(p.doc.tabLabel,p.value))
 console.log(`${plans.length} documents to convert`)
 if(!process.argv.includes('--apply')||!plans.length)return
 fs.mkdirSync('backups',{recursive:true})
 fs.writeFileSync(`backups/story-tab-labels-${Date.now()}.json`,JSON.stringify(plans.map(p=>p.doc),null,2),{mode:0o600})
 let tx=client.transaction()
 for(const {doc,value} of plans)tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set({tabLabel:value}))
 await tx.commit()
 for(const {doc,value}of plans){const saved=await client.getDocument(doc._id);if(!isDeepStrictEqual(saved?.tabLabel,value))throw new Error('Verification failed')}
 console.log('Converted and verified all translations; draft and published states preserved.')
}
run().catch(e=>{console.error(e.message);process.exitCode=1})
