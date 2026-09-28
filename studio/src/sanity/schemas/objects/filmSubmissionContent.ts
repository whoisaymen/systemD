import { defineField } from 'sanity'
import copyDefaults from '../../../../../frontend/src/content/filmSubmissionCopy.json'
import { FormCopyInput } from '../../components/FormCopyInput'
import { formGroups, formGroupFor, formTitles } from './filmSubmissionGroups'
const getField = (name: string) => copyDefaults[name as keyof typeof copyDefaults]
export const filmSubmissionContent = defineField({
 name: 'filmSubmissionContent', title: 'Contenu du formulaire', type: 'array',
 description: 'Sélectionnez une étape ou recherchez un texte. Chaque entrée contient ses traductions.',
 components: {input: FormCopyInput},
 options: {sortable: false},
 of: [{name:'formCopyEntry',title:'Texte du formulaire',type:'object',fields:[
  defineField({name:'name',title:'Texte à modifier',type:'string',hidden:({value})=>Boolean(value),options:{list:Object.entries(copyDefaults).map(([value,f])=>({value,title:f.label}))},validation:R=>R.required()}),
  defineField({name:'richContent',title:'Texte et mise en forme',type:'internationalizedArrayRichText',hidden:({parent})=>!parent?.name || Boolean(getField(parent.name)?.native)}),
  defineField({name:'nativeText',title:'Texte',type:'internationalizedArrayString',hidden:({parent})=>!parent?.name || !getField(parent.name)?.native}),
 ],preview:{select:{name:'name'},prepare:({name})=>{const f=getField(name);return {title:formTitles[name] ?? f?.label ?? 'Choisir un texte',subtitle:f?formGroups.find(g=>g.name===formGroupFor(name,f.group))?.title:undefined}}}}],
 validation: R=>R.custom((value:any[]|undefined)=>new Set(value?.map(e=>e.name)).size===(value?.length??0)||'Chaque texte doit apparaître une seule fois.'),
})
