import fs from 'node:fs'
import path from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { getCliClient } from 'sanity/cli'
import defaults from '../../frontend/src/content/filmSubmissionCopy.json'
import errors from '../../frontend/src/content/filmSubmissionErrors.json'
process.loadEnvFile(path.resolve('../frontend/.env.local'))
const client = getCliClient({apiVersion:'2026-09-12'}).withConfig({useCdn:false,perspective:'raw',token:process.env.SANITY_API_WRITE_TOKEN})
const apply = process.argv.includes('--apply')
async function run() {
 const docs = await client.fetch<any[]>('*[_type == "filmSubmissionSettings"]')
 const plans = docs.map(doc => {
  const old = doc.filmSubmissionContent
  if (!Array.isArray(old)) throw new Error('Expected form copy entries')
  const next = structuredClone(old)
  for (const [key, translations] of Object.entries(errors)) {
   let entry = next.find((e:any)=>e.name===key)
   if (!entry) {entry={_key:key,_type:'formCopyEntry',name:key,nativeText:[]};next.push(entry)}
   const values = entry.nativeText ?? []
   if (!Array.isArray(values)) throw new Error(`Unexpected translation shape: ${key}`)
   entry.nativeText = [...values]
   for (const [language, value] of Object.entries(translations)) {
    const index = entry.nativeText.findIndex((e:any)=>(e.language || e._key)===language)
    if(index < 0) entry.nativeText.push({_key:language,_type:'internationalizedArrayStringValue',language,value})
    else if (entry.nativeText[index].value === defaults[key as keyof typeof defaults].value || !entry.nativeText[index].value) entry.nativeText[index] = {...entry.nativeText[index], value}
   }
  }
  return {doc,next}
 }).filter(({doc,next})=>!isDeepStrictEqual(doc.filmSubmissionContent,next))
 console.log(`${plans.length} documents ${apply?'to update':'would be updated'}. Existing custom translations remain unchanged.`)
 if(!apply || !plans.length) return
 fs.mkdirSync('backups',{recursive:true})
 fs.writeFileSync(`backups/form-editor-${Date.now()}.json`,JSON.stringify(plans.map(p=>p.doc),null,2),{mode:0o600})
 let tx=client.transaction()
 for(const {doc,next} of plans) tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set({filmSubmissionContent:next}))
 await tx.commit()
 for(const {doc,next} of plans) {
  const saved=await client.getDocument(doc._id)
  if(!isDeepStrictEqual(saved?.filmSubmissionContent,next)) throw new Error('Verification failed')
 }
 console.log('Updated and verified. Draft and published documents remain separate.')
}
run().catch(e=>{console.error(e.message);process.exitCode=1})
