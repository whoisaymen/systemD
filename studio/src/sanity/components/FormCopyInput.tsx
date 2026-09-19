import {useState} from 'react'
import {Button, Flex, Stack, TextInput, Text, Select} from '@sanity/ui'
import type {ArrayOfObjectsInputProps} from 'sanity'
import errorCopy from '../../../../frontend/src/content/filmSubmissionErrors.json'
import defaults from '../../../../frontend/src/content/filmSubmissionCopy.json'
import {formGroups, formGroupFor} from '../schemas/objects/filmSubmissionGroups'
export function FormCopyInput(props: ArrayOfObjectsInputProps) {
 const [group,setGroup]=useState('intro')
 const [search,setSearch]=useState('')
 const [filmPart,setFilmPart]=useState('fields')
 const missing=Object.entries(defaults).filter(([name])=>!props.value?.some(e=>(e as {name?:string}).name===name))
 const members=props.members.filter(member=>{
  if(member.kind!=='item') return true
  const name=(member.item.value as {name?: string} | undefined)?.name as keyof typeof defaults
  const field=defaults[name]
  if(!field) return true
  if (!search && group==='step2') {
   const part=field.group==='placeholders'?'examples':/^(genre|format|language[A-Z])/.test(name)?'choices':'fields'
   if(part!==filmPart) return false
  }
  return search ? `${field.label} ${name}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()) : formGroupFor(name,field.group)===group
 })
 return <Stack gap={4}>
  <Flex gap={2} wrap="wrap">{formGroups.map(g=><Button key={g.name} text={g.title} mode={group===g.name&&!search?'default':'ghost'} tone="primary" onClick={()=>{setGroup(g.name);setSearch('')}} />)}</Flex>
  {group==='step2'&&!search&&<Flex gap={2}>{[['fields','Champs'],['examples','Exemples de saisie'],['choices','Choix proposés']].map(([key,title])=><Button key={key} text={title} mode={filmPart===key?'default':'ghost'} onClick={()=>setFilmPart(key)} />)}</Flex>}
  <TextInput aria-label="Rechercher un texte" placeholder="Rechercher un texte" value={search} onChange={e=>setSearch(e.currentTarget.value)} />
  <Text size={1} muted>{members.length} textes</Text>
  {props.renderDefault({...props,members,arrayFunctions:()=>null})}
  {missing.length>0&&<Select aria-label="Ajouter un texte manquant" value="" disabled={props.readOnly} onChange={e=>{
   const name=e.currentTarget.value as keyof typeof defaults
   if(!name) return
   const field=defaults[name]
   const value=field.native?(errorCopy[name as keyof typeof errorCopy]?.fr ?? field.value):[{_key:crypto.randomUUID(),_type:'block',style:'normal',markDefs:[],children:[{_key:crypto.randomUUID(),_type:'span',marks:[],text:field.value}]}]
   const entry={_key:crypto.randomUUID(),_type:'formCopyEntry',name,[field.native?'nativeText':'richContent']:[{_key:'fr',language:'fr',_type:field.native?'internationalizedArrayStringValue':'internationalizedArrayRichTextValue',value}]}
   props.onItemAppend(entry)
   setSearch('');setGroup(formGroupFor(name,field.group))
  }}><option value="">Ajouter un texte manquant</option>{missing.map(([key,f])=><option key={key} value={key}>{f.label}</option>)}</Select>}
 </Stack>
}
