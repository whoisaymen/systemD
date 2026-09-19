import fs from 'node:fs'
import path from 'node:path'
import {isDeepStrictEqual} from 'node:util'
import {createClient} from '@sanity/client'
import translations from './lib/fabriqueTranslations.json'
import legacyCopy from '../../frontend/src/content/fabriqueCopy.json'
import {richTextToPlainText, textToRichText} from '../../frontend/src/lib/richText'
process.loadEnvFile(path.resolve('../frontend/.env.local'))
const client=createClient({projectId:'s7yacqk1',dataset:'production',apiVersion:'2026-09-12',useCdn:false,perspective:'raw',token:process.env.SANITY_API_WRITE_TOKEN})
const locales=['fr','en','nl'] as const
function entryValue(entries:any[],locale:string){return entries?.find(e=>(e.language||e._key)===locale)?.value}
function localized(entries:any[]|undefined,locale:string,value:any){return {...entries?.find(e=>(e.language||e._key)===locale),_key:entries?.find(e=>(e.language||e._key)===locale)?._key||locale,_type:'internationalizedArrayRichTextValue',language:locale,value}}
function blocks(text:string,key:string,style='normal'){return textToRichText(text).map((b:any,i:number)=>({...b,_key:`${key}-${i}`,style}))}
const knownLeads=[
 'System_D and the Citylab Pianofabriek team support your stories and imaginations in several ways.',
 'System_D et l’équipe Citylab du Pianofabriek soutenons vos histoires et imaginaires sur plusieurs façons:',
 'System_D en het Citylab team van Pianofabriek ondersteunen jullie verhalen en verbeelding op verschillende manieren:',
]
async function run(){
 const docs=await client.fetch<any[]>('*[_type == "fabrique"]')
 const plans=docs.map(doc=>{
  const next=structuredClone(doc)
  const localeOrder=(entries:any[])=>[...locales].sort((a,b)=>(entries?.findIndex(e=>(e.language||e._key)===a)??9)-(entries?.findIndex(e=>(e.language||e._key)===b)??9))
  next.description=localeOrder(doc.description).map(locale=>{
   const old=entryValue(doc.description,locale)
   const currentText=richTextToPlainText(old)
   const details=entryValue(doc.details,locale)
   const extra=richTextToPlainText(details)
   // Replace the known misplaced festival recap only; preserve later editorial changes.
   const lead=(!currentText||knownLeads.includes(currentText))?blocks(translations.description[locale][0],'intro','h2'):textToRichText(old)
   const tail=(!extra||extra===legacyCopy.details)?blocks(translations.description[locale][1],'context'):textToRichText(details).map((b:any)=>({...b,_key:`details-${b._key}`}))
   const merged=currentText===translations.description[locale].join('\n\n')?textToRichText(old):[...lead,...tail]
   return localized(doc.description,locale,merged)
  })
  next.closingText=localeOrder(doc.closingText).map(locale=>{
   const old=entryValue(doc.closingText,locale)
   const text=richTextToPlainText(old)
   return localized(doc.closingText,locale,(!text||text===legacyCopy.closingText)?blocks(translations.closingText[locale],'closing','h2'):old)
  })
  next.actions=doc.actions.map((a:any)=>{
   const action=structuredClone(a)
   const copy=translations.actions[a._key as keyof typeof translations.actions]
   if(!copy)throw new Error(`Unrecognized action ${a._key}`)
   // Older published actions combined title and subtitle in a single string.
   for(const locale of ['en','fr']) {
    const label=entryValue(action.title,locale)
    if(typeof label==='string' && label.includes(' - ')) {
     const [title,...tail]=label.split(' - ')
     action.title=action.title.map((e:any)=>(e.language||e._key)===locale?localized(action.title,locale,blocks(title,'title')):e)
     if(!richTextToPlainText(entryValue(action.subtitle,locale))) action.subtitle=[...(action.subtitle||[]).filter((e:any)=>(e.language||e._key)!==locale),localized(action.subtitle,locale,blocks(tail.join(' - '),'subtitle'))]
    }
   }
   // Preserve formatting and translations; fill missing Dutch copy.
   for(const field of ['title','subtitle'] as const){
    const entries=action[field]||[]
    if(!richTextToPlainText(entryValue(entries,'nl'))){
     action[field]=entries.filter((e:any)=>(e.language||e._key)!=='nl')
     action[field].push(localized(entries,'nl',blocks(copy[field],field)))
    }
   }
   if(!action.text?.nl?.some((b:any)=>richTextToPlainText([b]).trim()))action.text={...action.text,nl:action.text.en.map((b:any,i:number)=>({...b,_key:`nl-${b._key}`,children:[{_key:`nl-span-${i}`,_type:'span',marks:[],text:copy.text[i]}]})).filter((b:any)=>b.children[0].text?.trim())}
   for(const b of action.text?.fr||[])for(const span of b.children||[])if(typeof span.text==='string')span.text=span.text.replace('ton projet ton projet audiovisuel','ton projet audiovisuel').replace('ainsi que projection au Pianofabriek','ainsi que des projections à la Pianofabriek')
   return action
  })
  delete next.details
  return {doc,next}
 }).filter(({doc,next})=>!isDeepStrictEqual(doc,next))
 console.log(`${plans.length} documents ${process.argv.includes('--apply')?'to update':'would be updated'}`)
 if(!process.argv.includes('--apply')||!plans.length)return
 fs.mkdirSync('backups',{recursive:true});fs.writeFileSync(`backups/fabrique-merge-${Date.now()}.json`,JSON.stringify(plans.map(p=>p.doc),null,2),{mode:0o600})
 let tx=client.transaction()
 for(const {doc,next}of plans)tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).set({description:next.description,closingText:next.closingText,actions:next.actions}).unset(['details']))
 await tx.commit()
 for(const {doc,next}of plans){const saved=await client.getDocument(doc._id);for(const f of ['description','closingText','actions'])if(!isDeepStrictEqual(saved?.[f],next[f]))throw new Error(`Verification failed: ${doc._id}.${f}`);if(saved?.details!==undefined)throw new Error('Retired details field remains')}
 console.log('Merged and verified all three languages. Draft and published documents remain separate.')
}
run().catch(e=>{console.error(e.message);process.exitCode=1})
