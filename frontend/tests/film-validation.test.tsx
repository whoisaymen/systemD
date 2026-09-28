import test from 'node:test'
import assert from 'node:assert/strict'
import {createFilmSubmissionSchema} from '../src/lib/filmSubmissionSchema'
import messages from '../src/content/filmSubmissionErrors.json'
for(const locale of ['fr','en','nl'] as const) {
 test(`Missing and malformed form values use ${locale} validation copy`,()=>{
  const schema=createFilmSubmissionSchema(key=>messages[key as keyof typeof messages]?.[locale] ?? key)
  for(const data of [{}, {contactName:'',phoneNumber:'',email:'wrong',instagram:'',yearOfCreation:NaN,duration:NaN,filmFormat:'wrong',languages:[],dataConsent:false}]){
   const result=schema.safeParse(data)
   assert.equal(result.success,false)
   if(!result.success) for(const issue of result.error.issues) {
    assert.ok(Object.values(messages).some(m=>m[locale]===issue.message), issue.message)
   }
  }
 })
}
