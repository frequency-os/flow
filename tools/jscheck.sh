#!/bin/sh
# Перевіряє синтаксис JS-файлу через движок JavaScriptCore, вбудований у macOS.
osascript -l JavaScript -e 'ObjC.import("Foundation");
var a=$.NSProcessInfo.processInfo.arguments; var f=ObjC.unwrap(a.objectAtIndex(a.count-1));
var p=$.NSString.stringWithContentsOfFileEncodingError(f,4,null).js;
try{ new Function(p); "OK" }catch(e){ "ERR: "+e.message }' "$1"
