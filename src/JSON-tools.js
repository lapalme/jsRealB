/**
    jsRealB 4.5
    Guy Lapalme, lapalme@iro.umontreal.ca, August 2022
 */

import { Constituent} from "./Constituent.js";
import {Terminal} from "./Terminal.js"
import {Phrase} from "./Phrase.js"
import {Dependent} from "./Dependent.js"
export {fromJSON,ppJSON}

/// Functions for dealing with JSON input

// list of names of constituents (used in fromJSON)
const terminals = ["N", "A", "Pro", "D", "V", "Adv", "C", "P", "DT", "NO", "Q"];
const phrases   = ["S", "NP", "AP", "VP", "AdvP", "PP", "CP", "SP"];
const dependents = ["root", "det", "subj", "comp", "mod", "compObj", "compObl", "coord"];

/**
 * Create a Constituent from a parsed JSON structure
 * <a href="http://rali.iro.umontreal.ca/JSrealB/current/data/jsRealB-jsonInput.html">more info</a>
 * @param {Object} json to convert
 * @param {"en"|"fr"} lang language for this object 
 * @returns Constituent corresponding to the JSON structure 
 */
function fromJSON(json,lang){
    if (typeof json == "object" && !Array.isArray(json)){
        if (json["lang"]){
            if (json["lang"]=="en")     lang="en";
            else if (json["lang"]=="fr")lang="fr";
            else {
                console.log("FromJSON: lang should be 'en' or 'fr', not "+json["lang"]+" 'en' will be used");
                lang="en";
            }
        }
        let lang1 = lang || currentLanguage ;
        if ("phrase" in json) {
            const constType=json["phrase"];
            if (phrases.includes(constType)){
                return Phrase.fromJSON(constType,json,lang1)
            } else {
                console.log("fromJSON: unknown Phrase type:"+constType)
            }
        } else if ("dependent" in json) {
            const constType=json["dependent"];
            if (dependents.includes(constType)){
                return Dependent.fromJSON(constType,json,lang1)
            } else {
                console.log("fromJSON: unknown Phrase type:"+constType)
            }
        } else if ("terminal" in json){
            const constType=json["terminal"];
            if (terminals.includes(constType)){
                return Terminal.fromJSON(constType,json,lang1)
            } else {
                console.log("fromJSON: unknown Terminal type:"+constType)
            }
        }
    } else {
        console.log("fromJSON: object expected, but found "+typeof json+":"+JSON.stringify(json))
    }
}

/**
 * Add properties to the current object from the information in the JSON object
 * It applies the "usual" jsRealB options
 * @param {Object} json 
 * @returns this object
 */
Constituent.prototype.setJSONprops = function(json){
    if ("props" in json){
        const props=json["props"];
        for (let opt in props){
            if (opt in this){
                if (Array.isArray(props[opt])){ // deal with a list of options
                    props[opt].forEach(o=>Array.isArray(o)
                        ? Constituent.prototype[opt].apply(this,o)
                        : Constituent.prototype[opt].call(this,o))
                } else 
                    Constituent.prototype[opt].call(this,props[opt])
            } else if (!["pat","h"].includes(opt)){ // do not copy the pat or h properties of a verb
                console.log("Constituent.fromJSON: illegal prop:"+opt);
            }
        }
    }
    return this
}

/**
 * Transform a JSON object into a Phrase
 * @param {String} constType kind of Phrase to create
 * @param {Object} json JSON object to transform
 * @param {string?} lang optional language
 * @returns new Phrase corresponding to the fields of the JSON object
 */
Phrase.fromJSON = function(constType,json,lang){
    if ("elements" in json){
        const elements=json["elements"];
        if (Array.isArray(elements)){
            const args=elements.map(json => fromJSON(json,lang));
            return new Phrase(args,constType,lang).setJSONprops(json);
        } else {
            console.log("Phrase.fromJSON: elements should be an array:"+JSON.stringify(json))
        }
    } else {
        console.log("Phrase.fromJSON: no elements found in "+JSON.stringify(json))
    }
}

/**
 * Transform a JSON object into a Dependent
 * @param {String} constType kind of Dependent to create
 * @param {Object} json JSON object to transform
 * @param {string?} lang optional language
 * @returns new Dependent corresponding to the fields of the JSON object
 */
 Dependent.fromJSON = function(constType,json,lang){
    if (!("terminal" in json)){
        console.log("Dependent.fromJSON: no terminal found in Dependent:"+JSON.stringify(json));
    } else {
        if ("dependents" in json){
            const dependents=json["dependents"];
            if (Array.isArray(dependents)){
                let args=dependents.map(json => fromJSON(json,lang));
                args.unshift(fromJSON(json["terminal"],lang));
                return new Dependent(args,constType,lang).setJSONprops(json);
            } else {
                console.log("Dependent.fromJSON: dependents should be an array:"+JSON.stringify(json))
            }
        } else {
            console.log("Dependent.fromJSON: no dependents found in "+JSON.stringify(json))
        }
    }
}

/**
 * Create a Terminal from a JSON representation
 * @param {string} constType type of Terminal to create
 * @param {Object} json json Object to transform
 * @param {"en"|"fr"} lang language for this Terminal
 * @returns Terminal
 */
Terminal.fromJSON = function(constType,json,lang){
    if ("lemma" in json){
        return new Terminal([json["lemma"]],constType,lang).setJSONprops(json);
    } else {
        console.log("Terminal.fromJSON: no lemma found in "+JSON.stringify(json));
    }
}

/**
 * Create an Object with appropriate fields for JSON input
 * @returns an Object which can be serialized as a JSON object
 */
Phrase.prototype.toJSON = function(){
    let res={phrase:this.constType, elements:this.elements.map(e=>e.toJSON())};
    if (Object.keys(this.props).length>0) // do not output empty props
        res.props=this.props;
    if (this.parentConst==null || this.lang!=this.parentConst.lang) // only indicate when language changes
        res.lang=this.lang;
    return res;
}

/**
 * Create an Object with appropriate fields for JSON input
 * @returns an Object which can be serialized as a JSON object
 */
Dependent.prototype.toJSON = function (){
    let res={dependent:this.constType, 
                terminal: this.terminal.toJSON()};
    if (this.dependents)
        res["dependents"]=this.dependents.map(e=>e.toJSON());
    if (Object.keys(this.props).length>0) // do not output empty props
        res.props=this.props;
    if (this.parentConst==null || this.lang!=this.parentConst.lang) // only indicate when language changes
        res.lang=this.lang;
    return res;
}

/**
 * Create an object that can be serialized as a JSON object with fields terminal and lemma
 * @returns Object with the appropriate JSON fields corresponding to this Terminal
 */
Terminal.prototype.toJSON = function(){
    let res={terminal:this.constType,lemma:this.lemma};
    if (Object.keys(this.props).length>0) // do not output empty props
        res.props=this.props;
    if (this.parentConst==null || this.lang!=this.parentConst.lang) // only indicate when language changes
        res.lang=this.lang;
    return res;
}

/**
 * Compact pretty-print of json (JSON.stringify(.,null,n) is hard to work with as it uses too many lines)
 * Adaptation of ppJson.py (in project json-rnc)
 * only useful for debugging, not necessary for using jsRealB
 * @param {Object} obj JSON object to pretty-print
 * @param {int?} level indentation level, 0 if omitted 
 * @param {String} str string to which new info is appended, "" if omitted
 * @returns indented string
 */
function ppJSON(obj,level,str){
    function out(s){str+=s}
    function outQuoted(s){
        if (s.includes('\\'))s=s.replace(/\\/g,'\\\\');
        if (s.includes('"' ))s=s.replace(/"/g,'\\"');
        out('"'+s+'"');
    }
    switch (arguments.length) {
    case 1:return ppJSON(obj,0,"");
    case 2:return ppJSON(obj,level,"");
    default:
        switch (typeof obj) {
        case "string":
            outQuoted(obj);
            break;
        case "object":
            if (obj===null){
                out("null")
            } else if (Array.isArray(obj)){
                out('[');
                const n=obj.length;
                // indent only if one of the elements of the array is an object != null 
                const indent = obj.some((e)=>typeof e == "object" && e!==null)
                for (var i = 1; i <= n; i++) {
                    const elem=obj[i-1];
                    if (indent && i>1)out("\n"+" ".repeat(level+1));
                    out(ppJSON(elem,level+1,""));
                    if (i<n)out(",")
                }
                out(']');
            } else {
                out('{');
                const keys=Object.keys(obj);
                const n=keys.length;
                for (var i = 1; i <= n; i++) {
                    const key=keys[i-1];
                    if (i>1)out("\n"+" ".repeat(level+1));
                    outQuoted(key);
                    out(":");
                    out(ppJSON(obj[key],level+1+key.length+3,""));
                    if (i<n)out(",")
                }
                out('}');
            }
            break;
        default: // primitive JavaScript values : boolean, number, string
            out(obj);
        }
    }
    return str;
}
