(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// go-j2h/index.js

module.exports = (function () {

// PRIVATE Properties/Methods
var v = {

    id: 0,
    primitiveTypesNotNull: {'string':1, 'number':1, 'boolean':1, 'symbol': 1},
        // since typeof null yields 'object', it's handled separately

    msgTypes: {

        primary: {
                // void tags
            area: 0, base: 0, br: 0, col: 0, embed: 0, hr: 0, img: 0, input: 0, keygen: 0, link: 0, meta: 0, param: 0, source: 0, track: 0, wbr: 0, 

                // non-void tags
            a: 1, abbr: 1, address: 1, article: 1, aside: 1, audio: 1, b: 1, bdi: 1, bdo: 1, blockquote: 1, body: 1, button: 1, canvas: 1, caption: 1, cite: 1, code: 1, colgroup: 1, datalist: 1, dd: 1, del: 1, details: 1, dfn: 1, dialog: 1, div: 1, dl: 1, dt: 1, em: 1, fieldset: 1, figcaption: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, head: 1, header: 1, hgroup: 1, html: 1, i: 1, iframe: 1, ins: 1, kbd: 1, label: 1, legend: 1, li: 1, map: 1, mark: 1, menu: 1, meter: 1, nav: 1, noscript: 1, object: 1, ol: 1, optgroup: 1, option: 1, output: 1, p: 1, pre: 1, progress: 1, q: 1, rp: 1, rt: 1, ruby: 1, s: 1, samp: 1, script: 1, section: 1, select: 1, small: 1, span: 1, strong: 1, style: 1, sub: 1, summary: 1, sup: 1, svg: 1, table: 1, tbody: 1, td: 1, textarea: 1, tfoot: 1, th: 1, thead: 1, time: 1, title: 1, tr: 1, u: 1, ul: 1, 'var': 1, video: 1,
        },

        secondary: {style: 1},
            // elements that can be either a primary tag itself or an attribute of another primary tag
            // if any other primary tags is present, then secondary tags are treated as
            // attributes of the other primary tag

        meta: {
            empty: 1, rm: 1, 
            prepend: 1, append: 1, before: 1, after: 1, parent: 1,
            attr: 1, content: 1, text: 1, 
        },

    },

    msg0: require ('go-msg'),
    msg: null,

}; // end PRIVATE properties
var f={};

//---------------------
f.init = () => {
    
    v.msg = new v.msg0 (v.msgTypes);

}; // end f.init


//---------------------
f.attr = (selector, attr) => {
    
    $(selector)
    .attr (attr);

}; // end f.attr 


//---------------------
f.empty = (selector) => {
    
    $(selector)
    .empty ()
    .off ('keydown');

}; // end f.empty 



//---------------------
f.rm = (selector) => {

    $(selector)
    .remove ();

}; // end f.rm


//---------------------
f.displayObH = (parent, dispOb) => {
    
        // ----  doArray ----
    var doArray = function (dispOb) {

        var Ids = [];
        for (var i = 0; i < dispOb.length; i++) {

            Ids.push (f.displayObH (parent, dispOb [i]));

        } // end for (var i = 0; i < dispOb.length; i++)

        return Ids [Ids.length - 1];
        //return Ids;
        
    };  // end doArray 

        // ----  doObject ----
    var doObject = function (dispOb) {

        var dispObParsed = v.msg.parseMsg (dispOb);

        var primaryKey = dispObParsed.p;

        var meta = dispObParsed.m;

        var delKey = null;
        var relLoc = 'append';

        var attr = null;
        var content = null;
        var text = null;

        if (meta.hasOwnProperty ('parent')) {
            // ensures processing of 'parent' before remainder of meta keys

            parent = meta.parent;
            delete meta.parent;

        } // end if (meta.hasOwnProperty ('parent'))
        
        var metaKeys = Object.keys (meta);
        for (var idx = 0; idx < metaKeys.length; idx++) {

            var key = metaKeys [idx];
            switch (key) {

                case 'empty':
                case 'rm':
                    delKey = key;
                    parent = meta [key];
                    break;

                case 'attr':
                    attr = meta.attr;
                    break;

                case 'content':
                    content = meta.content;
                    break;
                case 'text':
                    text = meta.text;
                    break;

                case 'prepend':
                case 'append':
                case 'before':
                case 'after':
                    relLoc = key;
                    var val = meta [key];
                    var doParent = val !== 1 && val !== true;
                    parent = doParent ? val : parent;
                        // if val is other than 1 or true, relLoc overrides both parent values passed 
                        // into displayObH and defined by optional parent attribute
                    break;

            } // end switch (key)
            

        } // end for (var idx = 0; idx < metaKeys.length; idx++)
        

        Id = null;

        if (delKey) {

            f [delKey] (parent);

        } else if (attr) {

            f.attr (parent, attr);

        } else if (content) {
            // replaces entire content of parent with new content

            $(parent)
            .empty ();

            f.displayObH (parent, content);
                // without emptying first, will simply append content to existing content

        } else if (text) {

            Id = f.textMake (parent, relLoc, text);

        } else {

            Id = f.elementMake (parent, relLoc, primaryKey, dispObParsed.c, dispObParsed.s);

        } // end if (delKey)

        return Id;
        
    };  // end doObject 



       // ---- main ----
    var Id;
    var dispObType = typeof dispOb;

    if (dispObType === 'undefined' || dispOb === 0 || dispOb === null) {

        Id = null;

    } else if (v.primitiveTypesNotNull.hasOwnProperty (dispObType)) {

        Id = f.textMake (parent, 'append', dispOb);
            // if text should be placed at other than 'append' location, then use
            // 'text' tag and specify prepend, after or before as needed

    } else if (Array.isArray (dispOb)) {

        Id = doArray (dispOb);

    } else if (dispObType == 'object') {

        Id = doObject (dispOb);

    } else {

        Id = null;

    } // end if (typeof dispOb === 'undefined' || dispOb === 0 || dispOb === null)
    
    return Id;

}; // end f.displayObH 

//---------------------
f.elementMake = (parentOrSiblId, relLoc, elName, content, attrs) => {
    
    var id;
    var attrKeys = Object.keys (attrs);
    var hasAttrs = attrKeys.length > 0;

    if (hasAttrs && attrs.hasOwnProperty ('id')) {

        id = attrs.id;

    } else {

        id = P.genId ();

    } // end if (hasAttrs)
    
    var Id = '#' + id;
    
    if (elName === 'script' && content !== 0) {
        // https://stackoverflow.com/questions/9413737/how-to-append-script-script-in-javascript
        // inspired by SO question, but setting innerHTML isn't supposed to work
        // therefore, set src attribute with path to file, instead of 
        // setting innerHTML to content of file

        // https://stackoverflow.com/questions/610995/cant-append-script-element
        // jQuery won't add script element as it does with any other element.  Therefore, must be done
        // using only javascript as follows:
        var script = document.createElement("script");

        script.src = content;
        script.id = attrs.id;
        
        document.head.appendChild(script);     

    } else {

        var divel = '<' + elName + ' id="' + id + '"';
    
        if (content) {
    
            divel += '></' + elName + '>';
    
        } else {
    
            divel += '>';
    
        } // end if (content)
    
        $(parentOrSiblId)[relLoc] (divel);

    } // end if (elName === 'script')
    
    
    if (hasAttrs) {
        
        $(Id)
        .attr (attrs);

    } // end if (hasAttrs)

    f.displayObH (Id, content);
    
    if (elName === 'form') {

        $(parent)
        .focus ();

    } // end if (elName === 'form')
    
    return Id;

}; // end f.elementMake


//---------------------
f.textMake = (parent, relLoc, primitive) => {
    
    if (typeof primitive === 'string') {
        
        var singlequote = '&#x0027;';
        var backslash = '&#x005c;';
        var doublequote = '&#x0022;';
        var lt = '&lt;';
        
        primitive = primitive.replace (/'/g, singlequote);
        primitive = primitive.replace (/"/g, doublequote);
        primitive = primitive.replace (/\\/g, backslash);
        primitive = primitive.replace (/</g, lt);

    } else if (typeof primitive === 'symbol') {

        primitive = 'symbol';
            // otherwise stringify would produce '{}' which is less useful

    } else {

        primitive = JSON.stringify (primitive);

    } // end if (typeof primitive === 'string')
    

    $(parent) [relLoc] (primitive);

    return null;
        // text obs have no id's: only text is appended with no way to address it
        // if addressing is necessary, use span instead of text

}; // end f.textMake 



// PUBLIC Properties/Methods
var P = {};

//---------------------
P.displayOb = (dispOb) => {
    // if dispOb is an array, only the last Id is returned
    
    var parent = 'body';
        // if parent not found, append to body

    if (typeof dispOb === 'object' && dispOb.hasOwnProperty ('parent')) {

        parent = dispOb.parent;

    } // end if (typeof dispOb === 'object' && dispOb.hasOwnProperty ('parent'))
    
    var Id = f.displayObH (parent, dispOb);

    return Id;

}; // end P.displayOb 

//---------------------
P.displayObA = (dispObA) => {
    // this is the way displayOb should have been written in the first place, to always
    // return an array if Ids, if the argument is an array
    
    var Ids;
    if (Array.isArray (dispObA)) {

        var parent = dispObA.hasOwnProperty ('parent') ? dispObA.parent : 'body';

        Ids = [];
        for (var ix = 0; ix < dispObA.length; ix++) {

            Ids.push (f.displayObH (parent, dispObA [ix]));

        } // end for (var ix = 0; ix < dispObA.length; ix++)

    } else {

        Ids = P.displayOb (dispObA);

    } // end if (Array.isArray (dispObA))
    
    return Ids;

}; // end P.displayObA 


P.displayPage = P.displayOb;

//---------------------
P.genId = () => {

    var id = 'i' + v.id++;
    return id;

}; // end P.genId


//---------------------
P.genIds = () => {
    
    var id = P.genId ();
    var Id = '#' + id;

    return [id, Id];

}; // end P.genIds



// end PUBLIC section

f.init ();

return P;

}());




},{"go-msg":3}],2:[function(require,module,exports){
// go-key/index.js

module.exports = function (jqSelector, reportShift, keyDownHandler, reportUp, keyUpHandler) {

// PRIVATE Properties/Methods
var v = {

    jqSelector: 'body',
    reportShift: false,
    keyDownHandler: null,
    reportUp: false,
    keyUpHandler: null,

    kShift: false,
    kCtrl: false,
    kAlt: false,
    kCmd: false,
    kIgnore: false,
    whichShiftKeys: {16:1, 17:1, 18:1, 91:1, 92:1, 93:1, 224:1},

            // not printable or non-ascii block
    ctrlOrNonAscii: {
        8: 'Backspace',
        9: 'Tab',
        13: 'Enter',
        16: 'Shift',
        17: 'Ctrl',
        18: 'Alt',
        19: 'Pause-break',
        20: 'Caps-lock',
        27: 'Esc',
        32: ' ',  // Space
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'Left',
        38: 'Up',
        39: 'Right',
        40: 'Down',
        45: 'Insert',
        46: 'Delete',
        91: 'WindowsKeyLeft',
        92: 'WindowsKeyRight',
        93: 'WindowsOptionKey',
        96: '0',  // Numpad
        97: '1',  // Numpad
        98: '2',  // Numpad
        99: '3',  // Numpad
        100: '4',  // Numpad
        101: '5',  // Numpad
        102: '6',  // Numpad
        103: '7',  // Numpad
        104: '8',  // Numpad
        105: '9',  // Numpad
        106: '*',  // Numpad
        107: '+',  // Numpad
        109: '-',  // Numpad
        110: '.',  // Numpad
        111: '/',  // Numpad
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        144: 'Numlock',
        145: 'Scroll-lock',
        224: 'MacCmd',
    },
    
    
    //---------------------
    asciiUnShifted: {
        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',
        59: ';',
        61: '=',
        65: 'a',
        66: 'b',
        67: 'c',
        68: 'd',
        69: 'e',
        70: 'f',
        71: 'g',
        72: 'h',
        73: 'i',
        74: 'j',
        75: 'k',
        76: 'l',
        77: 'm',
        78: 'n',
        79: 'o',
        80: 'p',
        81: 'q',
        82: 'r',
        83: 's',
        84: 't',
        85: 'u',
        86: 'v',
        87: 'w',
        88: 'x',
        89: 'y',
        90: 'z',
        173: '-',
        188: ',',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: "\\",
        221: ']',
        222: "'",
    186: ";",  // ditto for ';'
    187: "=",  // apparently, chrome thinks which is 187 for '=', but not firefox
    189: "-",  // ditto for '-'
    },
    
    
    //---------------------
    asciiShifted: {
        48: ')',
        49: '!',
        50: '@',
        51: '#',
        52: '$',
        53: '%',
        54: '^',
        55: '&',
        56: '*',
        57: '(',
        59: ':',
        61: '+',
        65: 'A',
        66: 'B',
        67: 'C',
        68: 'D',
        69: 'E',
        70: 'F',
        71: 'G',
        72: 'H',
        73: 'I',
        74: 'J',
        75: 'K',
        76: 'L',
        77: 'M',
        78: 'N',
        79: 'O',
        80: 'P',
        81: 'Q',
        82: 'R',
        83: 'S',
        84: 'T',
        85: 'U',
        86: 'V',
        87: 'W',
        88: 'X',
        89: 'Y',
        90: 'Z',
        173: '_',
        188: '<',
        190: '>',
        191: '?',
        192: '~',
        219: '{',
        220: '|',
        221: '}',
        222: '"',
    186: ":",  // ditto for ':'
    187: "+",  // ditto for '+'
    189: "_",  // ditto for '-'
    },


}; // end PRIVATE properties
var f={};
//---------------------
f.init = () => {
    
    v.jqSelector = jqSelector ? jqSelector : 'body';
    v.reportShift = reportShift ? reportShift : false;
    v.keyDownHandler = keyDownHandler ? keyDownHandler : f.defaultHandler;
    v.reportUp = reportUp ? reportUp : false;
    v.keyUpHandler = keyUpHandler ? keyUpHandler : f.defaultHandler;

    //P.setKeyOn (v.jqSelector);
    P.setKeyOn ();
    if (typeof _m0 === 'undefined') {

        _m0 = {};

    } // end if (typeof _m0 === 'undefined')
    
    
    if (!_m0.keyEvents) {

        _m0.keyEvents = {};
        /*
            // override jquery's remove function to turn on all key handlers after removal of a form
        var rmOrig = $.fn.remove;
        $.fn.remove = function (){

            $(this)
            .has ('form')
            .each (function () {
                P.allKeysOn ();
            });

            rmOrig.apply (this, arguments);
        }
        */

    } // end if (!_m0.keyEvents)

    var keyEvents = _m0.keyEvents;
    keyEvents [v.jqSelector] = {on: P.setKeyOn, off: P.setKeyOff};
    

}; // end f.init

//---------------------
f.cKeyDown = (event) => {
    // callback is v.keyDownHndler
    // returns ch object reflecting which shift keys were pressed down, ch and which values
    //
    // v.reportShift true => trigger callback for each keydown event of any key, 
    //                       including any shift key
    //     false => shift key event reported only when the next non-shift keydown event.
    //              So, callback is only triggered for non-shift key events
    
    //console.log ('go-key.cKeyDown jqSelector: ' + v.jqSelector);

    var which = event.which;

        // never ignore 'Esc' key == 27
    if (v.kIgnore && which != 27) {

        return;

    } // end if (kIgnore)
    
    event.preventDefault();
    event.stopPropagation ();

    var isAShiftKey = true;
    switch (which) {

        case 16: 
            v.kShift = true;
            break;

        case 17: 
            v.kCtrl = true;
            break;

        case 18: 
            v.kAlt = true;
            break;

        case 91: 
        case 92: 
        case 93: 
        case 224:
            v.kCmd = true;
            break;

        default:
            isAShiftKey = false;
            break;

    }   

    f.cKeyUpDownFinish (isAShiftKey, which, v.keyDownHandler);

    /*
    if (!isAShiftKey) {

        v.kShift = false;
        v.kCtrl = false;
        v.kAlt = false;
        v.kCmd = false;

    } // end if (!isAShiftKey)
    */
    

}; // end f.cKeyDown 


//---------------------
f.cKeyUp = (event) => {
    // callback is v.keyDownHndler
    
    var which = event.which;

        // never ignore 'Esc' key == 27
    if (v.kIgnore && which != 27) {

        return;

    } // end if (kIgnore)
    
    event.preventDefault();
    event.stopPropagation ();

    var isAShiftKey = true;
    switch (which) {

        case 16: 
            v.kShift = false;
            break;
        case 17: 
            v.kCtrl = false;
            break;
        case 18: 
            v.kAlt = false;
            break;
        case 91: 
        case 92: 
        case 93: 
        case 224: 
            v.kCmd = false;
            break;

        default:
            isAShiftKey = false;
            break;

    }   

    if (!v.reportUp) {

        return;

    } // end if (!reportUp)
    
    f.cKeyUpDownFinish (isAShiftKey, which, v.keyUpHandler);

}; // end f.cKeyUp 

//---------------------
f.cKeyUpDownFinish = (isAShiftKey, which, callback) => {
    
    if (isAShiftKey && !v.reportShift) {

        return;

    } // end if (isAShiftKey && !v.reportShift)
    
    var thisCh = f.getKeyCode (which);

    var chOb = ({
        shift: v.kShift,
        ctrl: v.kCtrl,
        alt: v.kAlt,
        macCmd: v.kCmd,
        which: which,
        ch: thisCh,
        isAShiftKey: isAShiftKey,
    });

    // console.log ('chOb: ' + JSON.stringify (chOb) + '\n');
    /*
    if (v.reportShift) {

        chOb.isAShiftKey = isAShiftKey;  
            // true if any of: shift, ctrl, alt, or macCmd are true
            // only relevant if v.reportShift is true

    } // end if (v.reportShift)
    */

    callback (chOb);

}; // end f.cKeyUpDownFinish 


//---------------------
f.defaultHandler = (chOb) => {
    
    var chObS = JSON.stringify (chOb);
    console.log ('go-key.defaultHandler.chOb: ' + chObS);

}; // end f.defaultHandler 



//---------------------
f.getKeyCode = (which) => {
    

    var ch;

    if (v.ctrlOrNonAscii.hasOwnProperty (which)) {

        ch = v.ctrlOrNonAscii [which];

    } else if (v.kShift && v.asciiShifted.hasOwnProperty (which)) {

        ch = v.asciiShifted [which];

    } else if (!v.kShift && v.asciiUnShifted.hasOwnProperty (which)) {

        ch = v.asciiUnShifted [which];

    } else {

        ch = null;

    } // end if 

    return ch;

}; // end f.getKeyCode 



//---------------------
f.initKeyDown = (jqSelector) => {
    
    $(jqSelector)
    .off('keydown')
    .keydown (function (event) {
        //console.log (' ==> initKeyDown');
        f.cKeyDown (event);
    });

}; // end f.initKeyDown 


//---------------------
f.initKeyUp = (jqSelector) => {
    
    $(jqSelector)
    .off('keyup')
    .keyup (function (event) {
        //console.log (' ==> initKeyUp');
        f.cKeyUp (event);
    });

}; // end f.initKeyUp 



// PUBLIC Properties/Methods
var P = {};

//---------------------
P.allKeysOff = () => {
    
    var keyEvents = _m0.keyEvents;
    var keySels = Object.keys (keyEvents);

    keySels.forEach (function (el) {

        keyEvents [el].off ();
    });

}; // end P.allKeysOff


//---------------------
P.allKeysOn = () => {
    
    var keyEvents = _m0.keyEvents;
    var keySels = Object.keys (keyEvents);

    keySels.forEach (function (el) {

        keyEvents [el].on ();
    });

}; // end P.allKeysOn


//---------------------
P.setKeyOff = () => {
    
        //console.log ('SETKEYOFF go-key.setKeyOff     jqSelector = ' + v.jqSelector);
    $(v.jqSelector)
    .off ('keydown')
    .off ('keyup');

}; // end P.setKeyOff


//---------------------
//P.setKeyOn = (jqSel) => {
P.setKeyOn = () => {
    
        //console.log ('SETKEYON go-key.setKeyOn   jqSelector = ' + v.jqSelector);
    //f.initKeyUp (jqSel);
    //f.initKeyDown (jqSel);
    f.initKeyUp (v.jqSelector);
    f.initKeyDown (v.jqSelector);

}; // end P.setKeyHandler

// end PUBLIC section

f.init ();

return P;

};

},{}],3:[function(require,module,exports){
// go-msg/index.js
// go-msg object has a unique primary msg and zero or more optional attributes


module.exports = function (p0) {

    // PRIVATE Properties
var v = {

    primary: null,
        // primary: {cmd: 1} (contains optional content) or {cmd: 0} (no optional content allowed)

    secondary: null,
        // if a primary message has an optional attribute that concidentally is the same as
        // another primary message, it should be have a key/value pair in secondary {attr: 1}
        // to ensure that it will be treated as an attribute in case a primary is present
        // Secondary is only tested if there exists a primary key

    meta: null,
        // meta parameters intended for ctrl or other purpose outside of primary and secondary msg
        // parameter usage

};  // end PRIVATE properties

    // PRIVATE Functions
f = {};


f.init = () => {

    v.primary = p0.primary;
    v.secondary = p0.hasOwnProperty ('secondary') ? p0.secondary : {};
    v.meta = p0.hasOwnProperty ('meta') ? p0.meta : {};
};

    // PUBLIC Functions
var P = {};

//---------------------
P.parseMsg = (msgOb) => {
    
    var res = {};
    var msgKeys = Object.keys (msgOb);

    var primaryCandidatesOb = {};
    var attrsOb = {};
    var metaOb = {};

    var key;
    for (var i = 0; i < msgKeys.length; i++) {

        key = msgKeys [i];
        
        if (v.primary.hasOwnProperty (key)) {

            primaryCandidatesOb [key] = 1;

        } else if (v.meta.hasOwnProperty (key)) {

            metaOb [key] = msgOb [key];

        } else {

            attrsOb [key] = msgOb [key];

        } // end if (v.primary.hasOwnProperty (key))
        
    } // end for (var i = 0; i < msgKeys.length; i++)

    var primaryCandidatesA = Object.keys (primaryCandidatesOb);

    var primaryKey;
    var content;

    if (primaryCandidatesA.length === 0) {

        primaryKey = null;

    } else if (primaryCandidatesA.length === 1) {

        primaryKey = primaryCandidatesA [0];

    } else {
        // handle primary/secondary key resolution

        primaryKey = null;
        for (key in primaryCandidatesOb) {

            if (v.secondary.hasOwnProperty (key)) {

                attrsOb [key] = msgOb [key];

            } else {

                if (primaryKey === null) {

                    primaryKey = key;

                } else {

                    res.err = 'Multiple primary keys found not in secondary object: ' + JSON.stringify (msg);

                } // end if (primaryKey === null)
                

            } // end if (v.secondary.hasOwnProperty (key))
            
        }

    } // end if (primaryCandidatesA.length === 0)


    if (!res.hasOwnProperty ('err')) {

        res.p = primaryKey;
        res.c = primaryKey && v.primary [primaryKey] !== 0 ? msgOb [primaryKey] : null;
            // example void html tag has zero content, so content is forced to null

        res.s = attrsOb;
        res.m = metaOb;

    } // end if (!res.hasOwnProperty ('err'))
    
    
    return res;

}; // end P.parseMsg 



    // end PUBLIC Functions

f.init ();

return P;

};




},{}],4:[function(require,module,exports){
// index0.js

(function () {

    $(document).ready (() => {
        require ('rpn.js');
    })
}())


},{"rpn.js":5}],5:[function(require,module,exports){
// rpn.js

module.exports = (function () {

    // PRIVATE Properties
var v = {

    j2h: require ('go-j2h'),
    dpp: null,
    genIds: null,

    IdStack: null,
    IdButtons: {},

    ky0: require ('go-key'),
    IdRgstrs: [],
    stack: [],

    editingX: false,

    keyMap: {
        'b': 'bs',
        'c': 'chs',
        'd': 'drop',
        'e': 'eex',
        'l': 'last',
        's': 'swap',
    },

    last: [],

};
    // PRIVATE Functions
var f = {};


//---------------------
f.init = () => {

    v.dpp = v.j2h.displayObA;
    v.genIds = v.j2h.genIds;

    f.render ();

    v.ky = new v.ky0 ('body', false, f.keyDown);
    f.clicks ();
    
};

//---------------------
f.action = (key) => {
    
        // ----  actionBinary ----
    var actionBinary = function (op) {

            // ----  doBinaryOp ----
        var doBinaryOp = function () {
    
            var res;
    
                // now that the x,y values have been validated, remove from stack
            v.stack.shift ();
            v.stack.shift ();
    
            switch (op) {
    
                case '+':
    
                    res = yVal + xVal;
                    break;
    
                case '-':
    
                    res = yVal - xVal;
                    break;
    
                case 'x':
                case '*':
    
                    res = yVal * xVal;
                    break;
    
                case '/':
    
                    res = yVal / xVal;
                    break;
    
            } // end switch (op)
            
    
            if (op === 'swap') {
    
                v.stack.unshift (xVal0);
                v.stack.unshift (yVal0);
    
            } else {
    
                v.stack.unshift (JSON.stringify (res));
    
                v.last = [];
                v.last.unshift (xVal0);
                v.last.unshift (yVal0);
    
    
            } // end if (op === 'swap')
            
            v.editingX = false;
            
        };  // end doBinaryOp
    
    
           // ---- main ----
        if (v.stack.length >= 2) {
    
            var xVal, yVal;
    
            var xVal0 = v.stack [0];
            var yVal0 = v.stack [1];
    
            try {
                xVal = JSON.parse (xVal0);
                
                try {
                    yVal = JSON.parse (yVal0);
                    doBinaryOp ();
    
                } catch (err) {
    
                }
    
            } catch (err) {
                
            }
    
    
        } // end if (v.stack.length >= 2)
        
    };  // end actionBinary 



        // ----  actionBS ----
    var actionBS = function () {

        var xVal = v.stack [0];

        if (v.editingX) {

            xVal = xVal.slice (0, -1);
            if (xVal.length === 0) {

                actionDrop ();

            } else {

                v.stack [0] = xVal;

            } // end if (xVal.length === 0)
            

        } else {

            actionDrop ();

        } // end if (v.editingX)
        
    };  // end actionBS


        // ----  actionChs ----
    var actionChs = function () {

        var res;

        var xVal = v.stack [0];

        if (v.editingX && xVal.match (/E/)) {

            res = xVal.match (/E-/) ? xVal.replace (/E-/, 'E') : xVal.replace (/E/, 'E-');

        } else if (xVal.substring (0, 1) === '-') {

            res = xVal.substring (1);

        } else {

            res = '-' + xVal;

        } // end if (v.editingX && xVal.match (/E/))

        v.stack [0] = res;
        
    };  // end actionChs


        // ----  actionDrop ----
    var actionDrop = function () {

        if (v.stack.length > 0) {

            v.last = [v.stack.shift ()];

        } // end if (v.stack.length > 0)
        
    };  // end actionDrop


        // ----  actionEnter ----
    var actionEnter = function () {

        var xVal0 = v.stack [0];

        try {

                // no need to get return from parse. Only needed to test if str represents a number
            JSON.parse (xVal0);

            if (v.editingX) {
    
                v.editingX = false;
    
            } else {
    
                v.stack.unshift (v.stack [0]);   
    
            } // end if (v.editingX)

            v.last = [];

        } catch (err) {

        }

        
    };  // end actionEnter


        // ----  actionNum ----
    var actionNum = function (key0) {

        var key;
        
        if (v.editingX) {
    
            key = key0 === 'eex' ? 'E' : key0;
        
            // TODO dotEntered only once
            v.stack [0] += key;
        
        } else {
        
            key = key0 === 'eex' ? '1E' : key0;
            v.editingX = true;
            v.stack.unshift (key);
        
        } // end if (v.editingX)
    
    };  // end actionNum 


        // ----  actionRestore ----
    var actionRestore = function () {

        if (v.last.length > 1) {
            // if binary op, remove the x value before unshifting y and x

            v.stack.shift ();

        } // end if (v.last.length > 1)
        
        while (v.last.length > 0) {

            v.stack.unshift (v.last.shift ());

        } // end while (v.last.length > 0)
        
        
    };  // end actionRestore




       // ---- main ----
    switch (key) {

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
        case '.':
        case 'eex':

            actionNum (key);
            break;

        case 'chs':

            actionChs ();
            break;

        case '+':
        case 'x':
        case '*':
        case '-':
        case '/':

            actionBinary (key);
            break;

        case 'enter':

            actionEnter ();
            break;

        case 'bs':
        case 'backspace':

            actionBS ();
            break;
        
        case 'drop':

            actionDrop ();
            break;

        case 'swap':

            actionBinary ('swap');
            break;
        
        case 'last':

            actionRestore ();
            break;
    } // end switch (key)
    
    f.updateStack ();

}; // end f.action 


//---------------------
f.binaryOp = (op) => {
    
    

}; // end f.binaryOp 


//---------------------
f.clicks = () => {
    
    for (var key in v.IdButtons) {

        var Id = v.IdButtons [key];

        $(Id)
        .click ((event) => {
            var key = $('#' + event.target.id).text ();
            key = key === 'b' ? 'BS' : key;

            f.action (key);
        });
    }

}; // end f.clicks


//---------------------
f.keyDown = (keyOb) => {
    
    var key = keyOb.ch.toLowerCase ();

    key = v.keyMap.hasOwnProperty (key) ? v.keyMap [key] : key;

    f.action (key);

}; // end f.keyDown 


//---------------------
f.render = () => {
    
        // ----  buttonObs  ----
    var buttonObs = function (vals, parent) {

        res = [];
        for (var ix = 0; ix < vals.length; ix++) {

            var val = vals [ix];
            val = typeof val === 'string' ? val : JSON.stringify (val);

            var Ids = v.genIds ();
            var id = Ids [0];
            v.IdButtons [val] = Ids [1];
    
            var classStr = 'btn btn-sm mr-1';
            classStr += ' outline-num';
            classStr += val.length === 1 ? ' width26' : "";
    
            res.push ({button: val, id: id, class: classStr});

        } // end for (var ix = 0; ix < vals.length; ix++)
        
        res.parent = parent;
        return res;

    };  // end buttonObs  


       // ---- main ----
    f.renderStyle ();

    var IdRoot = v.dpp ({div:0, class: 'container mt-3'});
    var logo = {img: 0, class: 'd-block mb-1', src: 'Images/RPNCalc.png', parent: IdRoot};
    var sxsw = {img: 0, class: 'd-block widths mb-3', src: 'Images/sxsw2010.png', parent: IdRoot};
    var stack = {div: 0, class: 'border border-primary rounded w-50 mb-2 height24', parent: IdRoot};
//    var numbers = {div: 0, class: ''}

        // stack
    v.IdStack = v.dpp ([logo, sxsw, stack])[2];

    var rgstrLabels = ['x', 'y', 'z', 't'];
    rgstrLabels.forEach (function (label) {

        var Ids = v.genIds ();

        v.IdRgstrs.push (Ids [1]);

        var rgstrDisp = {div: [
            {label: label + ':' + '&nbsp;&nbsp;', class: 'text-primary ml-1 mb-0'},
            {span: 0, id: Ids [0]}
        ], prepend: 1, parent: v.IdStack};

        v.dpp (rgstrDisp);
        
    });


        // numbers
    var btnDiv = {div: 0, class: 'd-inline-block align-top mr-3', parent: IdRoot};

    var IdNumbers = v.dpp (btnDiv);
    
    var btnGroup = {div:0, class: 'mb-1', parent: IdNumbers};

    var Id123 = v.dpp (btnGroup);
    v.dpp (buttonObs ([1,2,3], Id123));

    var Id456 = v.dpp (btnGroup);
    v.dpp (buttonObs ([4,5,6], Id456));

    var Id789 = v.dpp (btnGroup);
    v.dpp (buttonObs ([7,8,9], Id789));

    var Id0 = v.dpp (btnGroup);
    var zerosDot = buttonObs (['b', 0, '.'], Id0);

    v.dpp (zerosDot);


        // + x - / Enter
    var IdOps1 = v.dpp (btnDiv);
    btnGroup.parent = IdOps1;

    var IdAddMult = v.dpp (btnGroup);
    v.dpp (buttonObs (['+', 'x'], IdAddMult));

    var IdSubDiv = v.dpp (btnGroup);
    v.dpp (buttonObs (['-', '/'], IdSubDiv));

    var IdEnter = v.dpp (btnGroup);
    v.dpp (buttonObs (['Enter'], IdEnter));


        // chs EEX drop swap last
    var IdOps2 = v.dpp (btnDiv);
    btnGroup.parent = IdOps2;

    var IdChsEEX = v.dpp (btnGroup);
    v.dpp (buttonObs (['chs', 'EEX'], IdChsEEX));

    var IdDropSwap = v.dpp (btnGroup);
    v.dpp (buttonObs (['drop', 'swap'], IdDropSwap));

    var IdLast = v.dpp (btnGroup);
    v.dpp (buttonObs (['last'], IdLast));




}; // end f.render


//---------------------
f.renderStyle = () => {
    
    var styleStr = `
        .height24 {
            height: 96px;
        }
        .darkgrey {
            color: darkgrey;
        }
        .outline-num {
            color: darkslateblue;
            border-color: #28a745;
        }
        .width26 {
            width: 26px;
        }
        .widths {
            width: 50%;
        } 
    `;

    var style = {style: styleStr, parent: 'head'};
    v.dpp (style);

}; // end f.renderStyle


//---------------------
f.updateStack = () => {
    
    for (var ix = 0; ix < 4; ix++) {

        var val = v.stack.length > ix ? v.stack [ix] : "";
        $(v.IdRgstrs [ix])
        .text (val);

    } // end for (var ix = 0; ix < 4; ix++)

    if (v.editingX) {

        $(v.IdRgstrs [0])
        .addClass ('darkgrey');

    } else {

        $(v.IdRgstrs [0])
        .removeClass ('darkgrey');

    } // end if (v.editingX)
    
    

}; // end f.updateStack


    // PUBLIC Functions
var P = {};

    // init
f.init ();

return P;

}());




},{"go-j2h":1,"go-key":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlc19nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9Ob2RlLmpzL25vZGVfbW9kdWxlcy9nby1qMmgvaW5kZXguanMiLCIuLi8uLi8uLi9Ob2RlLmpzL25vZGVfbW9kdWxlcy9nby1rZXkvaW5kZXguanMiLCIuLi8uLi8uLi9Ob2RlLmpzL25vZGVfbW9kdWxlcy9nby1tc2cvaW5kZXguanMiLCJpbmRleDAuanMiLCJycG4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGdvLWoyaC9pbmRleC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG5cbi8vIFBSSVZBVEUgUHJvcGVydGllcy9NZXRob2RzXG52YXIgdiA9IHtcblxuICAgIGlkOiAwLFxuICAgIHByaW1pdGl2ZVR5cGVzTm90TnVsbDogeydzdHJpbmcnOjEsICdudW1iZXInOjEsICdib29sZWFuJzoxLCAnc3ltYm9sJzogMX0sXG4gICAgICAgIC8vIHNpbmNlIHR5cGVvZiBudWxsIHlpZWxkcyAnb2JqZWN0JywgaXQncyBoYW5kbGVkIHNlcGFyYXRlbHlcblxuICAgIG1zZ1R5cGVzOiB7XG5cbiAgICAgICAgcHJpbWFyeToge1xuICAgICAgICAgICAgICAgIC8vIHZvaWQgdGFnc1xuICAgICAgICAgICAgYXJlYTogMCwgYmFzZTogMCwgYnI6IDAsIGNvbDogMCwgZW1iZWQ6IDAsIGhyOiAwLCBpbWc6IDAsIGlucHV0OiAwLCBrZXlnZW46IDAsIGxpbms6IDAsIG1ldGE6IDAsIHBhcmFtOiAwLCBzb3VyY2U6IDAsIHRyYWNrOiAwLCB3YnI6IDAsIFxuXG4gICAgICAgICAgICAgICAgLy8gbm9uLXZvaWQgdGFnc1xuICAgICAgICAgICAgYTogMSwgYWJicjogMSwgYWRkcmVzczogMSwgYXJ0aWNsZTogMSwgYXNpZGU6IDEsIGF1ZGlvOiAxLCBiOiAxLCBiZGk6IDEsIGJkbzogMSwgYmxvY2txdW90ZTogMSwgYm9keTogMSwgYnV0dG9uOiAxLCBjYW52YXM6IDEsIGNhcHRpb246IDEsIGNpdGU6IDEsIGNvZGU6IDEsIGNvbGdyb3VwOiAxLCBkYXRhbGlzdDogMSwgZGQ6IDEsIGRlbDogMSwgZGV0YWlsczogMSwgZGZuOiAxLCBkaWFsb2c6IDEsIGRpdjogMSwgZGw6IDEsIGR0OiAxLCBlbTogMSwgZmllbGRzZXQ6IDEsIGZpZ2NhcHRpb246IDEsIGZpZ3VyZTogMSwgZm9vdGVyOiAxLCBmb3JtOiAxLCBoMTogMSwgaDI6IDEsIGgzOiAxLCBoNDogMSwgaDU6IDEsIGg2OiAxLCBoZWFkOiAxLCBoZWFkZXI6IDEsIGhncm91cDogMSwgaHRtbDogMSwgaTogMSwgaWZyYW1lOiAxLCBpbnM6IDEsIGtiZDogMSwgbGFiZWw6IDEsIGxlZ2VuZDogMSwgbGk6IDEsIG1hcDogMSwgbWFyazogMSwgbWVudTogMSwgbWV0ZXI6IDEsIG5hdjogMSwgbm9zY3JpcHQ6IDEsIG9iamVjdDogMSwgb2w6IDEsIG9wdGdyb3VwOiAxLCBvcHRpb246IDEsIG91dHB1dDogMSwgcDogMSwgcHJlOiAxLCBwcm9ncmVzczogMSwgcTogMSwgcnA6IDEsIHJ0OiAxLCBydWJ5OiAxLCBzOiAxLCBzYW1wOiAxLCBzY3JpcHQ6IDEsIHNlY3Rpb246IDEsIHNlbGVjdDogMSwgc21hbGw6IDEsIHNwYW46IDEsIHN0cm9uZzogMSwgc3R5bGU6IDEsIHN1YjogMSwgc3VtbWFyeTogMSwgc3VwOiAxLCBzdmc6IDEsIHRhYmxlOiAxLCB0Ym9keTogMSwgdGQ6IDEsIHRleHRhcmVhOiAxLCB0Zm9vdDogMSwgdGg6IDEsIHRoZWFkOiAxLCB0aW1lOiAxLCB0aXRsZTogMSwgdHI6IDEsIHU6IDEsIHVsOiAxLCAndmFyJzogMSwgdmlkZW86IDEsXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2Vjb25kYXJ5OiB7c3R5bGU6IDF9LFxuICAgICAgICAgICAgLy8gZWxlbWVudHMgdGhhdCBjYW4gYmUgZWl0aGVyIGEgcHJpbWFyeSB0YWcgaXRzZWxmIG9yIGFuIGF0dHJpYnV0ZSBvZiBhbm90aGVyIHByaW1hcnkgdGFnXG4gICAgICAgICAgICAvLyBpZiBhbnkgb3RoZXIgcHJpbWFyeSB0YWdzIGlzIHByZXNlbnQsIHRoZW4gc2Vjb25kYXJ5IHRhZ3MgYXJlIHRyZWF0ZWQgYXNcbiAgICAgICAgICAgIC8vIGF0dHJpYnV0ZXMgb2YgdGhlIG90aGVyIHByaW1hcnkgdGFnXG5cbiAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgZW1wdHk6IDEsIHJtOiAxLCBcbiAgICAgICAgICAgIHByZXBlbmQ6IDEsIGFwcGVuZDogMSwgYmVmb3JlOiAxLCBhZnRlcjogMSwgcGFyZW50OiAxLFxuICAgICAgICAgICAgYXR0cjogMSwgY29udGVudDogMSwgdGV4dDogMSwgXG4gICAgICAgIH0sXG5cbiAgICB9LFxuXG4gICAgbXNnMDogcmVxdWlyZSAoJ2dvLW1zZycpLFxuICAgIG1zZzogbnVsbCxcblxufTsgLy8gZW5kIFBSSVZBVEUgcHJvcGVydGllc1xudmFyIGY9e307XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmluaXQgPSAoKSA9PiB7XG4gICAgXG4gICAgdi5tc2cgPSBuZXcgdi5tc2cwICh2Lm1zZ1R5cGVzKTtcblxufTsgLy8gZW5kIGYuaW5pdFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmF0dHIgPSAoc2VsZWN0b3IsIGF0dHIpID0+IHtcbiAgICBcbiAgICAkKHNlbGVjdG9yKVxuICAgIC5hdHRyIChhdHRyKTtcblxufTsgLy8gZW5kIGYuYXR0ciBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5lbXB0eSA9IChzZWxlY3RvcikgPT4ge1xuICAgIFxuICAgICQoc2VsZWN0b3IpXG4gICAgLmVtcHR5ICgpXG4gICAgLm9mZiAoJ2tleWRvd24nKTtcblxufTsgLy8gZW5kIGYuZW1wdHkgXG5cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5ybSA9IChzZWxlY3RvcikgPT4ge1xuXG4gICAgJChzZWxlY3RvcilcbiAgICAucmVtb3ZlICgpO1xuXG59OyAvLyBlbmQgZi5ybVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmRpc3BsYXlPYkggPSAocGFyZW50LCBkaXNwT2IpID0+IHtcbiAgICBcbiAgICAgICAgLy8gLS0tLSAgZG9BcnJheSAtLS0tXG4gICAgdmFyIGRvQXJyYXkgPSBmdW5jdGlvbiAoZGlzcE9iKSB7XG5cbiAgICAgICAgdmFyIElkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BPYi5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBJZHMucHVzaCAoZi5kaXNwbGF5T2JIIChwYXJlbnQsIGRpc3BPYiBbaV0pKTtcblxuICAgICAgICB9IC8vIGVuZCBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BPYi5sZW5ndGg7IGkrKylcblxuICAgICAgICByZXR1cm4gSWRzIFtJZHMubGVuZ3RoIC0gMV07XG4gICAgICAgIC8vcmV0dXJuIElkcztcbiAgICAgICAgXG4gICAgfTsgIC8vIGVuZCBkb0FycmF5IFxuXG4gICAgICAgIC8vIC0tLS0gIGRvT2JqZWN0IC0tLS1cbiAgICB2YXIgZG9PYmplY3QgPSBmdW5jdGlvbiAoZGlzcE9iKSB7XG5cbiAgICAgICAgdmFyIGRpc3BPYlBhcnNlZCA9IHYubXNnLnBhcnNlTXNnIChkaXNwT2IpO1xuXG4gICAgICAgIHZhciBwcmltYXJ5S2V5ID0gZGlzcE9iUGFyc2VkLnA7XG5cbiAgICAgICAgdmFyIG1ldGEgPSBkaXNwT2JQYXJzZWQubTtcblxuICAgICAgICB2YXIgZGVsS2V5ID0gbnVsbDtcbiAgICAgICAgdmFyIHJlbExvYyA9ICdhcHBlbmQnO1xuXG4gICAgICAgIHZhciBhdHRyID0gbnVsbDtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBudWxsO1xuICAgICAgICB2YXIgdGV4dCA9IG51bGw7XG5cbiAgICAgICAgaWYgKG1ldGEuaGFzT3duUHJvcGVydHkgKCdwYXJlbnQnKSkge1xuICAgICAgICAgICAgLy8gZW5zdXJlcyBwcm9jZXNzaW5nIG9mICdwYXJlbnQnIGJlZm9yZSByZW1haW5kZXIgb2YgbWV0YSBrZXlzXG5cbiAgICAgICAgICAgIHBhcmVudCA9IG1ldGEucGFyZW50O1xuICAgICAgICAgICAgZGVsZXRlIG1ldGEucGFyZW50O1xuXG4gICAgICAgIH0gLy8gZW5kIGlmIChtZXRhLmhhc093blByb3BlcnR5ICgncGFyZW50JykpXG4gICAgICAgIFxuICAgICAgICB2YXIgbWV0YUtleXMgPSBPYmplY3Qua2V5cyAobWV0YSk7XG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG1ldGFLZXlzLmxlbmd0aDsgaWR4KyspIHtcblxuICAgICAgICAgICAgdmFyIGtleSA9IG1ldGFLZXlzIFtpZHhdO1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtcHR5JzpcbiAgICAgICAgICAgICAgICBjYXNlICdybSc6XG4gICAgICAgICAgICAgICAgICAgIGRlbEtleSA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gbWV0YSBba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdhdHRyJzpcbiAgICAgICAgICAgICAgICAgICAgYXR0ciA9IG1ldGEuYXR0cjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IG1ldGEuY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSBtZXRhLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncHJlcGVuZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnYXBwZW5kJzpcbiAgICAgICAgICAgICAgICBjYXNlICdiZWZvcmUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2FmdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgcmVsTG9jID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gbWV0YSBba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvUGFyZW50ID0gdmFsICE9PSAxICYmIHZhbCAhPT0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZG9QYXJlbnQgPyB2YWwgOiBwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB2YWwgaXMgb3RoZXIgdGhhbiAxIG9yIHRydWUsIHJlbExvYyBvdmVycmlkZXMgYm90aCBwYXJlbnQgdmFsdWVzIHBhc3NlZCBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludG8gZGlzcGxheU9iSCBhbmQgZGVmaW5lZCBieSBvcHRpb25hbCBwYXJlbnQgYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9IC8vIGVuZCBzd2l0Y2ggKGtleSlcbiAgICAgICAgICAgIFxuXG4gICAgICAgIH0gLy8gZW5kIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG1ldGFLZXlzLmxlbmd0aDsgaWR4KyspXG4gICAgICAgIFxuXG4gICAgICAgIElkID0gbnVsbDtcblxuICAgICAgICBpZiAoZGVsS2V5KSB7XG5cbiAgICAgICAgICAgIGYgW2RlbEtleV0gKHBhcmVudCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChhdHRyKSB7XG5cbiAgICAgICAgICAgIGYuYXR0ciAocGFyZW50LCBhdHRyKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgICAgIC8vIHJlcGxhY2VzIGVudGlyZSBjb250ZW50IG9mIHBhcmVudCB3aXRoIG5ldyBjb250ZW50XG5cbiAgICAgICAgICAgICQocGFyZW50KVxuICAgICAgICAgICAgLmVtcHR5ICgpO1xuXG4gICAgICAgICAgICBmLmRpc3BsYXlPYkggKHBhcmVudCwgY29udGVudCk7XG4gICAgICAgICAgICAgICAgLy8gd2l0aG91dCBlbXB0eWluZyBmaXJzdCwgd2lsbCBzaW1wbHkgYXBwZW5kIGNvbnRlbnQgdG8gZXhpc3RpbmcgY29udGVudFxuXG4gICAgICAgIH0gZWxzZSBpZiAodGV4dCkge1xuXG4gICAgICAgICAgICBJZCA9IGYudGV4dE1ha2UgKHBhcmVudCwgcmVsTG9jLCB0ZXh0KTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBJZCA9IGYuZWxlbWVudE1ha2UgKHBhcmVudCwgcmVsTG9jLCBwcmltYXJ5S2V5LCBkaXNwT2JQYXJzZWQuYywgZGlzcE9iUGFyc2VkLnMpO1xuXG4gICAgICAgIH0gLy8gZW5kIGlmIChkZWxLZXkpXG5cbiAgICAgICAgcmV0dXJuIElkO1xuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGRvT2JqZWN0IFxuXG5cblxuICAgICAgIC8vIC0tLS0gbWFpbiAtLS0tXG4gICAgdmFyIElkO1xuICAgIHZhciBkaXNwT2JUeXBlID0gdHlwZW9mIGRpc3BPYjtcblxuICAgIGlmIChkaXNwT2JUeXBlID09PSAndW5kZWZpbmVkJyB8fCBkaXNwT2IgPT09IDAgfHwgZGlzcE9iID09PSBudWxsKSB7XG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgfSBlbHNlIGlmICh2LnByaW1pdGl2ZVR5cGVzTm90TnVsbC5oYXNPd25Qcm9wZXJ0eSAoZGlzcE9iVHlwZSkpIHtcblxuICAgICAgICBJZCA9IGYudGV4dE1ha2UgKHBhcmVudCwgJ2FwcGVuZCcsIGRpc3BPYik7XG4gICAgICAgICAgICAvLyBpZiB0ZXh0IHNob3VsZCBiZSBwbGFjZWQgYXQgb3RoZXIgdGhhbiAnYXBwZW5kJyBsb2NhdGlvbiwgdGhlbiB1c2VcbiAgICAgICAgICAgIC8vICd0ZXh0JyB0YWcgYW5kIHNwZWNpZnkgcHJlcGVuZCwgYWZ0ZXIgb3IgYmVmb3JlIGFzIG5lZWRlZFxuXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5IChkaXNwT2IpKSB7XG5cbiAgICAgICAgSWQgPSBkb0FycmF5IChkaXNwT2IpO1xuXG4gICAgfSBlbHNlIGlmIChkaXNwT2JUeXBlID09ICdvYmplY3QnKSB7XG5cbiAgICAgICAgSWQgPSBkb09iamVjdCAoZGlzcE9iKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgfSAvLyBlbmQgaWYgKHR5cGVvZiBkaXNwT2IgPT09ICd1bmRlZmluZWQnIHx8IGRpc3BPYiA9PT0gMCB8fCBkaXNwT2IgPT09IG51bGwpXG4gICAgXG4gICAgcmV0dXJuIElkO1xuXG59OyAvLyBlbmQgZi5kaXNwbGF5T2JIIFxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5lbGVtZW50TWFrZSA9IChwYXJlbnRPclNpYmxJZCwgcmVsTG9jLCBlbE5hbWUsIGNvbnRlbnQsIGF0dHJzKSA9PiB7XG4gICAgXG4gICAgdmFyIGlkO1xuICAgIHZhciBhdHRyS2V5cyA9IE9iamVjdC5rZXlzIChhdHRycyk7XG4gICAgdmFyIGhhc0F0dHJzID0gYXR0cktleXMubGVuZ3RoID4gMDtcblxuICAgIGlmIChoYXNBdHRycyAmJiBhdHRycy5oYXNPd25Qcm9wZXJ0eSAoJ2lkJykpIHtcblxuICAgICAgICBpZCA9IGF0dHJzLmlkO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBpZCA9IFAuZ2VuSWQgKCk7XG5cbiAgICB9IC8vIGVuZCBpZiAoaGFzQXR0cnMpXG4gICAgXG4gICAgdmFyIElkID0gJyMnICsgaWQ7XG4gICAgXG4gICAgaWYgKGVsTmFtZSA9PT0gJ3NjcmlwdCcgJiYgY29udGVudCAhPT0gMCkge1xuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDEzNzM3L2hvdy10by1hcHBlbmQtc2NyaXB0LXNjcmlwdC1pbi1qYXZhc2NyaXB0XG4gICAgICAgIC8vIGluc3BpcmVkIGJ5IFNPIHF1ZXN0aW9uLCBidXQgc2V0dGluZyBpbm5lckhUTUwgaXNuJ3Qgc3VwcG9zZWQgdG8gd29ya1xuICAgICAgICAvLyB0aGVyZWZvcmUsIHNldCBzcmMgYXR0cmlidXRlIHdpdGggcGF0aCB0byBmaWxlLCBpbnN0ZWFkIG9mIFxuICAgICAgICAvLyBzZXR0aW5nIGlubmVySFRNTCB0byBjb250ZW50IG9mIGZpbGVcblxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82MTA5OTUvY2FudC1hcHBlbmQtc2NyaXB0LWVsZW1lbnRcbiAgICAgICAgLy8galF1ZXJ5IHdvbid0IGFkZCBzY3JpcHQgZWxlbWVudCBhcyBpdCBkb2VzIHdpdGggYW55IG90aGVyIGVsZW1lbnQuICBUaGVyZWZvcmUsIG11c3QgYmUgZG9uZVxuICAgICAgICAvLyB1c2luZyBvbmx5IGphdmFzY3JpcHQgYXMgZm9sbG93czpcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG5cbiAgICAgICAgc2NyaXB0LnNyYyA9IGNvbnRlbnQ7XG4gICAgICAgIHNjcmlwdC5pZCA9IGF0dHJzLmlkO1xuICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOyAgICAgXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHZhciBkaXZlbCA9ICc8JyArIGVsTmFtZSArICcgaWQ9XCInICsgaWQgKyAnXCInO1xuICAgIFxuICAgICAgICBpZiAoY29udGVudCkge1xuICAgIFxuICAgICAgICAgICAgZGl2ZWwgKz0gJz48LycgKyBlbE5hbWUgKyAnPic7XG4gICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgXG4gICAgICAgICAgICBkaXZlbCArPSAnPic7XG4gICAgXG4gICAgICAgIH0gLy8gZW5kIGlmIChjb250ZW50KVxuICAgIFxuICAgICAgICAkKHBhcmVudE9yU2libElkKVtyZWxMb2NdIChkaXZlbCk7XG5cbiAgICB9IC8vIGVuZCBpZiAoZWxOYW1lID09PSAnc2NyaXB0JylcbiAgICBcbiAgICBcbiAgICBpZiAoaGFzQXR0cnMpIHtcbiAgICAgICAgXG4gICAgICAgICQoSWQpXG4gICAgICAgIC5hdHRyIChhdHRycyk7XG5cbiAgICB9IC8vIGVuZCBpZiAoaGFzQXR0cnMpXG5cbiAgICBmLmRpc3BsYXlPYkggKElkLCBjb250ZW50KTtcbiAgICBcbiAgICBpZiAoZWxOYW1lID09PSAnZm9ybScpIHtcblxuICAgICAgICAkKHBhcmVudClcbiAgICAgICAgLmZvY3VzICgpO1xuXG4gICAgfSAvLyBlbmQgaWYgKGVsTmFtZSA9PT0gJ2Zvcm0nKVxuICAgIFxuICAgIHJldHVybiBJZDtcblxufTsgLy8gZW5kIGYuZWxlbWVudE1ha2VcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi50ZXh0TWFrZSA9IChwYXJlbnQsIHJlbExvYywgcHJpbWl0aXZlKSA9PiB7XG4gICAgXG4gICAgaWYgKHR5cGVvZiBwcmltaXRpdmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgc2luZ2xlcXVvdGUgPSAnJiN4MDAyNzsnO1xuICAgICAgICB2YXIgYmFja3NsYXNoID0gJyYjeDAwNWM7JztcbiAgICAgICAgdmFyIGRvdWJsZXF1b3RlID0gJyYjeDAwMjI7JztcbiAgICAgICAgdmFyIGx0ID0gJyZsdDsnO1xuICAgICAgICBcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC8nL2csIHNpbmdsZXF1b3RlKTtcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC9cIi9nLCBkb3VibGVxdW90ZSk7XG4gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5yZXBsYWNlICgvXFxcXC9nLCBiYWNrc2xhc2gpO1xuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoLzwvZywgbHQpO1xuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcHJpbWl0aXZlID09PSAnc3ltYm9sJykge1xuXG4gICAgICAgIHByaW1pdGl2ZSA9ICdzeW1ib2wnO1xuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHN0cmluZ2lmeSB3b3VsZCBwcm9kdWNlICd7fScgd2hpY2ggaXMgbGVzcyB1c2VmdWxcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgcHJpbWl0aXZlID0gSlNPTi5zdHJpbmdpZnkgKHByaW1pdGl2ZSk7XG5cbiAgICB9IC8vIGVuZCBpZiAodHlwZW9mIHByaW1pdGl2ZSA9PT0gJ3N0cmluZycpXG4gICAgXG5cbiAgICAkKHBhcmVudCkgW3JlbExvY10gKHByaW1pdGl2ZSk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgLy8gdGV4dCBvYnMgaGF2ZSBubyBpZCdzOiBvbmx5IHRleHQgaXMgYXBwZW5kZWQgd2l0aCBubyB3YXkgdG8gYWRkcmVzcyBpdFxuICAgICAgICAvLyBpZiBhZGRyZXNzaW5nIGlzIG5lY2Vzc2FyeSwgdXNlIHNwYW4gaW5zdGVhZCBvZiB0ZXh0XG5cbn07IC8vIGVuZCBmLnRleHRNYWtlIFxuXG5cblxuLy8gUFVCTElDIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIFAgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuZGlzcGxheU9iID0gKGRpc3BPYikgPT4ge1xuICAgIC8vIGlmIGRpc3BPYiBpcyBhbiBhcnJheSwgb25seSB0aGUgbGFzdCBJZCBpcyByZXR1cm5lZFxuICAgIFxuICAgIHZhciBwYXJlbnQgPSAnYm9keSc7XG4gICAgICAgIC8vIGlmIHBhcmVudCBub3QgZm91bmQsIGFwcGVuZCB0byBib2R5XG5cbiAgICBpZiAodHlwZW9mIGRpc3BPYiA9PT0gJ29iamVjdCcgJiYgZGlzcE9iLmhhc093blByb3BlcnR5ICgncGFyZW50JykpIHtcblxuICAgICAgICBwYXJlbnQgPSBkaXNwT2IucGFyZW50O1xuXG4gICAgfSAvLyBlbmQgaWYgKHR5cGVvZiBkaXNwT2IgPT09ICdvYmplY3QnICYmIGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpKVxuICAgIFxuICAgIHZhciBJZCA9IGYuZGlzcGxheU9iSCAocGFyZW50LCBkaXNwT2IpO1xuXG4gICAgcmV0dXJuIElkO1xuXG59OyAvLyBlbmQgUC5kaXNwbGF5T2IgXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLmRpc3BsYXlPYkEgPSAoZGlzcE9iQSkgPT4ge1xuICAgIC8vIHRoaXMgaXMgdGhlIHdheSBkaXNwbGF5T2Igc2hvdWxkIGhhdmUgYmVlbiB3cml0dGVuIGluIHRoZSBmaXJzdCBwbGFjZSwgdG8gYWx3YXlzXG4gICAgLy8gcmV0dXJuIGFuIGFycmF5IGlmIElkcywgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIGFycmF5XG4gICAgXG4gICAgdmFyIElkcztcbiAgICBpZiAoQXJyYXkuaXNBcnJheSAoZGlzcE9iQSkpIHtcblxuICAgICAgICB2YXIgcGFyZW50ID0gZGlzcE9iQS5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpID8gZGlzcE9iQS5wYXJlbnQgOiAnYm9keSc7XG5cbiAgICAgICAgSWRzID0gW107XG4gICAgICAgIGZvciAodmFyIGl4ID0gMDsgaXggPCBkaXNwT2JBLmxlbmd0aDsgaXgrKykge1xuXG4gICAgICAgICAgICBJZHMucHVzaCAoZi5kaXNwbGF5T2JIIChwYXJlbnQsIGRpc3BPYkEgW2l4XSkpO1xuXG4gICAgICAgIH0gLy8gZW5kIGZvciAodmFyIGl4ID0gMDsgaXggPCBkaXNwT2JBLmxlbmd0aDsgaXgrKylcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgSWRzID0gUC5kaXNwbGF5T2IgKGRpc3BPYkEpO1xuXG4gICAgfSAvLyBlbmQgaWYgKEFycmF5LmlzQXJyYXkgKGRpc3BPYkEpKVxuICAgIFxuICAgIHJldHVybiBJZHM7XG5cbn07IC8vIGVuZCBQLmRpc3BsYXlPYkEgXG5cblxuUC5kaXNwbGF5UGFnZSA9IFAuZGlzcGxheU9iO1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5nZW5JZCA9ICgpID0+IHtcblxuICAgIHZhciBpZCA9ICdpJyArIHYuaWQrKztcbiAgICByZXR1cm4gaWQ7XG5cbn07IC8vIGVuZCBQLmdlbklkXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuZ2VuSWRzID0gKCkgPT4ge1xuICAgIFxuICAgIHZhciBpZCA9IFAuZ2VuSWQgKCk7XG4gICAgdmFyIElkID0gJyMnICsgaWQ7XG5cbiAgICByZXR1cm4gW2lkLCBJZF07XG5cbn07IC8vIGVuZCBQLmdlbklkc1xuXG5cblxuLy8gZW5kIFBVQkxJQyBzZWN0aW9uXG5cbmYuaW5pdCAoKTtcblxucmV0dXJuIFA7XG5cbn0oKSk7XG5cblxuXG4iLCIvLyBnby1rZXkvaW5kZXguanNcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoanFTZWxlY3RvciwgcmVwb3J0U2hpZnQsIGtleURvd25IYW5kbGVyLCByZXBvcnRVcCwga2V5VXBIYW5kbGVyKSB7XG5cbi8vIFBSSVZBVEUgUHJvcGVydGllcy9NZXRob2RzXG52YXIgdiA9IHtcblxuICAgIGpxU2VsZWN0b3I6ICdib2R5JyxcbiAgICByZXBvcnRTaGlmdDogZmFsc2UsXG4gICAga2V5RG93bkhhbmRsZXI6IG51bGwsXG4gICAgcmVwb3J0VXA6IGZhbHNlLFxuICAgIGtleVVwSGFuZGxlcjogbnVsbCxcblxuICAgIGtTaGlmdDogZmFsc2UsXG4gICAga0N0cmw6IGZhbHNlLFxuICAgIGtBbHQ6IGZhbHNlLFxuICAgIGtDbWQ6IGZhbHNlLFxuICAgIGtJZ25vcmU6IGZhbHNlLFxuICAgIHdoaWNoU2hpZnRLZXlzOiB7MTY6MSwgMTc6MSwgMTg6MSwgOTE6MSwgOTI6MSwgOTM6MSwgMjI0OjF9LFxuXG4gICAgICAgICAgICAvLyBub3QgcHJpbnRhYmxlIG9yIG5vbi1hc2NpaSBibG9ja1xuICAgIGN0cmxPck5vbkFzY2lpOiB7XG4gICAgICAgIDg6ICdCYWNrc3BhY2UnLFxuICAgICAgICA5OiAnVGFiJyxcbiAgICAgICAgMTM6ICdFbnRlcicsXG4gICAgICAgIDE2OiAnU2hpZnQnLFxuICAgICAgICAxNzogJ0N0cmwnLFxuICAgICAgICAxODogJ0FsdCcsXG4gICAgICAgIDE5OiAnUGF1c2UtYnJlYWsnLFxuICAgICAgICAyMDogJ0NhcHMtbG9jaycsXG4gICAgICAgIDI3OiAnRXNjJyxcbiAgICAgICAgMzI6ICcgJywgIC8vIFNwYWNlXG4gICAgICAgIDMzOiAnUGFnZVVwJyxcbiAgICAgICAgMzQ6ICdQYWdlRG93bicsXG4gICAgICAgIDM1OiAnRW5kJyxcbiAgICAgICAgMzY6ICdIb21lJyxcbiAgICAgICAgMzc6ICdMZWZ0JyxcbiAgICAgICAgMzg6ICdVcCcsXG4gICAgICAgIDM5OiAnUmlnaHQnLFxuICAgICAgICA0MDogJ0Rvd24nLFxuICAgICAgICA0NTogJ0luc2VydCcsXG4gICAgICAgIDQ2OiAnRGVsZXRlJyxcbiAgICAgICAgOTE6ICdXaW5kb3dzS2V5TGVmdCcsXG4gICAgICAgIDkyOiAnV2luZG93c0tleVJpZ2h0JyxcbiAgICAgICAgOTM6ICdXaW5kb3dzT3B0aW9uS2V5JyxcbiAgICAgICAgOTY6ICcwJywgIC8vIE51bXBhZFxuICAgICAgICA5NzogJzEnLCAgLy8gTnVtcGFkXG4gICAgICAgIDk4OiAnMicsICAvLyBOdW1wYWRcbiAgICAgICAgOTk6ICczJywgIC8vIE51bXBhZFxuICAgICAgICAxMDA6ICc0JywgIC8vIE51bXBhZFxuICAgICAgICAxMDE6ICc1JywgIC8vIE51bXBhZFxuICAgICAgICAxMDI6ICc2JywgIC8vIE51bXBhZFxuICAgICAgICAxMDM6ICc3JywgIC8vIE51bXBhZFxuICAgICAgICAxMDQ6ICc4JywgIC8vIE51bXBhZFxuICAgICAgICAxMDU6ICc5JywgIC8vIE51bXBhZFxuICAgICAgICAxMDY6ICcqJywgIC8vIE51bXBhZFxuICAgICAgICAxMDc6ICcrJywgIC8vIE51bXBhZFxuICAgICAgICAxMDk6ICctJywgIC8vIE51bXBhZFxuICAgICAgICAxMTA6ICcuJywgIC8vIE51bXBhZFxuICAgICAgICAxMTE6ICcvJywgIC8vIE51bXBhZFxuICAgICAgICAxMTI6ICdGMScsXG4gICAgICAgIDExMzogJ0YyJyxcbiAgICAgICAgMTE0OiAnRjMnLFxuICAgICAgICAxMTU6ICdGNCcsXG4gICAgICAgIDExNjogJ0Y1JyxcbiAgICAgICAgMTE3OiAnRjYnLFxuICAgICAgICAxMTg6ICdGNycsXG4gICAgICAgIDExOTogJ0Y4JyxcbiAgICAgICAgMTIwOiAnRjknLFxuICAgICAgICAxMjE6ICdGMTAnLFxuICAgICAgICAxMjI6ICdGMTEnLFxuICAgICAgICAxMjM6ICdGMTInLFxuICAgICAgICAxNDQ6ICdOdW1sb2NrJyxcbiAgICAgICAgMTQ1OiAnU2Nyb2xsLWxvY2snLFxuICAgICAgICAyMjQ6ICdNYWNDbWQnLFxuICAgIH0sXG4gICAgXG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhc2NpaVVuU2hpZnRlZDoge1xuICAgICAgICA0ODogJzAnLFxuICAgICAgICA0OTogJzEnLFxuICAgICAgICA1MDogJzInLFxuICAgICAgICA1MTogJzMnLFxuICAgICAgICA1MjogJzQnLFxuICAgICAgICA1MzogJzUnLFxuICAgICAgICA1NDogJzYnLFxuICAgICAgICA1NTogJzcnLFxuICAgICAgICA1NjogJzgnLFxuICAgICAgICA1NzogJzknLFxuICAgICAgICA1OTogJzsnLFxuICAgICAgICA2MTogJz0nLFxuICAgICAgICA2NTogJ2EnLFxuICAgICAgICA2NjogJ2InLFxuICAgICAgICA2NzogJ2MnLFxuICAgICAgICA2ODogJ2QnLFxuICAgICAgICA2OTogJ2UnLFxuICAgICAgICA3MDogJ2YnLFxuICAgICAgICA3MTogJ2cnLFxuICAgICAgICA3MjogJ2gnLFxuICAgICAgICA3MzogJ2knLFxuICAgICAgICA3NDogJ2onLFxuICAgICAgICA3NTogJ2snLFxuICAgICAgICA3NjogJ2wnLFxuICAgICAgICA3NzogJ20nLFxuICAgICAgICA3ODogJ24nLFxuICAgICAgICA3OTogJ28nLFxuICAgICAgICA4MDogJ3AnLFxuICAgICAgICA4MTogJ3EnLFxuICAgICAgICA4MjogJ3InLFxuICAgICAgICA4MzogJ3MnLFxuICAgICAgICA4NDogJ3QnLFxuICAgICAgICA4NTogJ3UnLFxuICAgICAgICA4NjogJ3YnLFxuICAgICAgICA4NzogJ3cnLFxuICAgICAgICA4ODogJ3gnLFxuICAgICAgICA4OTogJ3knLFxuICAgICAgICA5MDogJ3onLFxuICAgICAgICAxNzM6ICctJyxcbiAgICAgICAgMTg4OiAnLCcsXG4gICAgICAgIDE5MDogJy4nLFxuICAgICAgICAxOTE6ICcvJyxcbiAgICAgICAgMTkyOiAnYCcsXG4gICAgICAgIDIxOTogJ1snLFxuICAgICAgICAyMjA6IFwiXFxcXFwiLFxuICAgICAgICAyMjE6ICddJyxcbiAgICAgICAgMjIyOiBcIidcIixcbiAgICAxODY6IFwiO1wiLCAgLy8gZGl0dG8gZm9yICc7J1xuICAgIDE4NzogXCI9XCIsICAvLyBhcHBhcmVudGx5LCBjaHJvbWUgdGhpbmtzIHdoaWNoIGlzIDE4NyBmb3IgJz0nLCBidXQgbm90IGZpcmVmb3hcbiAgICAxODk6IFwiLVwiLCAgLy8gZGl0dG8gZm9yICctJ1xuICAgIH0sXG4gICAgXG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBhc2NpaVNoaWZ0ZWQ6IHtcbiAgICAgICAgNDg6ICcpJyxcbiAgICAgICAgNDk6ICchJyxcbiAgICAgICAgNTA6ICdAJyxcbiAgICAgICAgNTE6ICcjJyxcbiAgICAgICAgNTI6ICckJyxcbiAgICAgICAgNTM6ICclJyxcbiAgICAgICAgNTQ6ICdeJyxcbiAgICAgICAgNTU6ICcmJyxcbiAgICAgICAgNTY6ICcqJyxcbiAgICAgICAgNTc6ICcoJyxcbiAgICAgICAgNTk6ICc6JyxcbiAgICAgICAgNjE6ICcrJyxcbiAgICAgICAgNjU6ICdBJyxcbiAgICAgICAgNjY6ICdCJyxcbiAgICAgICAgNjc6ICdDJyxcbiAgICAgICAgNjg6ICdEJyxcbiAgICAgICAgNjk6ICdFJyxcbiAgICAgICAgNzA6ICdGJyxcbiAgICAgICAgNzE6ICdHJyxcbiAgICAgICAgNzI6ICdIJyxcbiAgICAgICAgNzM6ICdJJyxcbiAgICAgICAgNzQ6ICdKJyxcbiAgICAgICAgNzU6ICdLJyxcbiAgICAgICAgNzY6ICdMJyxcbiAgICAgICAgNzc6ICdNJyxcbiAgICAgICAgNzg6ICdOJyxcbiAgICAgICAgNzk6ICdPJyxcbiAgICAgICAgODA6ICdQJyxcbiAgICAgICAgODE6ICdRJyxcbiAgICAgICAgODI6ICdSJyxcbiAgICAgICAgODM6ICdTJyxcbiAgICAgICAgODQ6ICdUJyxcbiAgICAgICAgODU6ICdVJyxcbiAgICAgICAgODY6ICdWJyxcbiAgICAgICAgODc6ICdXJyxcbiAgICAgICAgODg6ICdYJyxcbiAgICAgICAgODk6ICdZJyxcbiAgICAgICAgOTA6ICdaJyxcbiAgICAgICAgMTczOiAnXycsXG4gICAgICAgIDE4ODogJzwnLFxuICAgICAgICAxOTA6ICc+JyxcbiAgICAgICAgMTkxOiAnPycsXG4gICAgICAgIDE5MjogJ34nLFxuICAgICAgICAyMTk6ICd7JyxcbiAgICAgICAgMjIwOiAnfCcsXG4gICAgICAgIDIyMTogJ30nLFxuICAgICAgICAyMjI6ICdcIicsXG4gICAgMTg2OiBcIjpcIiwgIC8vIGRpdHRvIGZvciAnOidcbiAgICAxODc6IFwiK1wiLCAgLy8gZGl0dG8gZm9yICcrJ1xuICAgIDE4OTogXCJfXCIsICAvLyBkaXR0byBmb3IgJy0nXG4gICAgfSxcblxuXG59OyAvLyBlbmQgUFJJVkFURSBwcm9wZXJ0aWVzXG52YXIgZj17fTtcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmluaXQgPSAoKSA9PiB7XG4gICAgXG4gICAgdi5qcVNlbGVjdG9yID0ganFTZWxlY3RvciA/IGpxU2VsZWN0b3IgOiAnYm9keSc7XG4gICAgdi5yZXBvcnRTaGlmdCA9IHJlcG9ydFNoaWZ0ID8gcmVwb3J0U2hpZnQgOiBmYWxzZTtcbiAgICB2LmtleURvd25IYW5kbGVyID0ga2V5RG93bkhhbmRsZXIgPyBrZXlEb3duSGFuZGxlciA6IGYuZGVmYXVsdEhhbmRsZXI7XG4gICAgdi5yZXBvcnRVcCA9IHJlcG9ydFVwID8gcmVwb3J0VXAgOiBmYWxzZTtcbiAgICB2LmtleVVwSGFuZGxlciA9IGtleVVwSGFuZGxlciA/IGtleVVwSGFuZGxlciA6IGYuZGVmYXVsdEhhbmRsZXI7XG5cbiAgICAvL1Auc2V0S2V5T24gKHYuanFTZWxlY3Rvcik7XG4gICAgUC5zZXRLZXlPbiAoKTtcbiAgICBpZiAodHlwZW9mIF9tMCA9PT0gJ3VuZGVmaW5lZCcpIHtcblxuICAgICAgICBfbTAgPSB7fTtcblxuICAgIH0gLy8gZW5kIGlmICh0eXBlb2YgX20wID09PSAndW5kZWZpbmVkJylcbiAgICBcbiAgICBcbiAgICBpZiAoIV9tMC5rZXlFdmVudHMpIHtcblxuICAgICAgICBfbTAua2V5RXZlbnRzID0ge307XG4gICAgICAgIC8qXG4gICAgICAgICAgICAvLyBvdmVycmlkZSBqcXVlcnkncyByZW1vdmUgZnVuY3Rpb24gdG8gdHVybiBvbiBhbGwga2V5IGhhbmRsZXJzIGFmdGVyIHJlbW92YWwgb2YgYSBmb3JtXG4gICAgICAgIHZhciBybU9yaWcgPSAkLmZuLnJlbW92ZTtcbiAgICAgICAgJC5mbi5yZW1vdmUgPSBmdW5jdGlvbiAoKXtcblxuICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgLmhhcyAoJ2Zvcm0nKVxuICAgICAgICAgICAgLmVhY2ggKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBQLmFsbEtleXNPbiAoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBybU9yaWcuYXBwbHkgKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cblxuICAgIH0gLy8gZW5kIGlmICghX20wLmtleUV2ZW50cylcblxuICAgIHZhciBrZXlFdmVudHMgPSBfbTAua2V5RXZlbnRzO1xuICAgIGtleUV2ZW50cyBbdi5qcVNlbGVjdG9yXSA9IHtvbjogUC5zZXRLZXlPbiwgb2ZmOiBQLnNldEtleU9mZn07XG4gICAgXG5cbn07IC8vIGVuZCBmLmluaXRcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuY0tleURvd24gPSAoZXZlbnQpID0+IHtcbiAgICAvLyBjYWxsYmFjayBpcyB2LmtleURvd25IbmRsZXJcbiAgICAvLyByZXR1cm5zIGNoIG9iamVjdCByZWZsZWN0aW5nIHdoaWNoIHNoaWZ0IGtleXMgd2VyZSBwcmVzc2VkIGRvd24sIGNoIGFuZCB3aGljaCB2YWx1ZXNcbiAgICAvL1xuICAgIC8vIHYucmVwb3J0U2hpZnQgdHJ1ZSA9PiB0cmlnZ2VyIGNhbGxiYWNrIGZvciBlYWNoIGtleWRvd24gZXZlbnQgb2YgYW55IGtleSwgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGluZyBhbnkgc2hpZnQga2V5XG4gICAgLy8gICAgIGZhbHNlID0+IHNoaWZ0IGtleSBldmVudCByZXBvcnRlZCBvbmx5IHdoZW4gdGhlIG5leHQgbm9uLXNoaWZ0IGtleWRvd24gZXZlbnQuXG4gICAgLy8gICAgICAgICAgICAgIFNvLCBjYWxsYmFjayBpcyBvbmx5IHRyaWdnZXJlZCBmb3Igbm9uLXNoaWZ0IGtleSBldmVudHNcbiAgICBcbiAgICAvL2NvbnNvbGUubG9nICgnZ28ta2V5LmNLZXlEb3duIGpxU2VsZWN0b3I6ICcgKyB2LmpxU2VsZWN0b3IpO1xuXG4gICAgdmFyIHdoaWNoID0gZXZlbnQud2hpY2g7XG5cbiAgICAgICAgLy8gbmV2ZXIgaWdub3JlICdFc2MnIGtleSA9PSAyN1xuICAgIGlmICh2LmtJZ25vcmUgJiYgd2hpY2ggIT0gMjcpIHtcblxuICAgICAgICByZXR1cm47XG5cbiAgICB9IC8vIGVuZCBpZiAoa0lnbm9yZSlcbiAgICBcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiAoKTtcblxuICAgIHZhciBpc0FTaGlmdEtleSA9IHRydWU7XG4gICAgc3dpdGNoICh3aGljaCkge1xuXG4gICAgICAgIGNhc2UgMTY6IFxuICAgICAgICAgICAgdi5rU2hpZnQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAxNzogXG4gICAgICAgICAgICB2LmtDdHJsID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMTg6IFxuICAgICAgICAgICAgdi5rQWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgOTE6IFxuICAgICAgICBjYXNlIDkyOiBcbiAgICAgICAgY2FzZSA5MzogXG4gICAgICAgIGNhc2UgMjI0OlxuICAgICAgICAgICAgdi5rQ21kID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBpc0FTaGlmdEtleSA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICB9ICAgXG5cbiAgICBmLmNLZXlVcERvd25GaW5pc2ggKGlzQVNoaWZ0S2V5LCB3aGljaCwgdi5rZXlEb3duSGFuZGxlcik7XG5cbiAgICAvKlxuICAgIGlmICghaXNBU2hpZnRLZXkpIHtcblxuICAgICAgICB2LmtTaGlmdCA9IGZhbHNlO1xuICAgICAgICB2LmtDdHJsID0gZmFsc2U7XG4gICAgICAgIHYua0FsdCA9IGZhbHNlO1xuICAgICAgICB2LmtDbWQgPSBmYWxzZTtcblxuICAgIH0gLy8gZW5kIGlmICghaXNBU2hpZnRLZXkpXG4gICAgKi9cbiAgICBcblxufTsgLy8gZW5kIGYuY0tleURvd24gXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuY0tleVVwID0gKGV2ZW50KSA9PiB7XG4gICAgLy8gY2FsbGJhY2sgaXMgdi5rZXlEb3duSG5kbGVyXG4gICAgXG4gICAgdmFyIHdoaWNoID0gZXZlbnQud2hpY2g7XG5cbiAgICAgICAgLy8gbmV2ZXIgaWdub3JlICdFc2MnIGtleSA9PSAyN1xuICAgIGlmICh2LmtJZ25vcmUgJiYgd2hpY2ggIT0gMjcpIHtcblxuICAgICAgICByZXR1cm47XG5cbiAgICB9IC8vIGVuZCBpZiAoa0lnbm9yZSlcbiAgICBcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbiAoKTtcblxuICAgIHZhciBpc0FTaGlmdEtleSA9IHRydWU7XG4gICAgc3dpdGNoICh3aGljaCkge1xuXG4gICAgICAgIGNhc2UgMTY6IFxuICAgICAgICAgICAgdi5rU2hpZnQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE3OiBcbiAgICAgICAgICAgIHYua0N0cmwgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE4OiBcbiAgICAgICAgICAgIHYua0FsdCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgOTE6IFxuICAgICAgICBjYXNlIDkyOiBcbiAgICAgICAgY2FzZSA5MzogXG4gICAgICAgIGNhc2UgMjI0OiBcbiAgICAgICAgICAgIHYua0NtZCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlzQVNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcblxuICAgIH0gICBcblxuICAgIGlmICghdi5yZXBvcnRVcCkge1xuXG4gICAgICAgIHJldHVybjtcblxuICAgIH0gLy8gZW5kIGlmICghcmVwb3J0VXApXG4gICAgXG4gICAgZi5jS2V5VXBEb3duRmluaXNoIChpc0FTaGlmdEtleSwgd2hpY2gsIHYua2V5VXBIYW5kbGVyKTtcblxufTsgLy8gZW5kIGYuY0tleVVwIFxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5jS2V5VXBEb3duRmluaXNoID0gKGlzQVNoaWZ0S2V5LCB3aGljaCwgY2FsbGJhY2spID0+IHtcbiAgICBcbiAgICBpZiAoaXNBU2hpZnRLZXkgJiYgIXYucmVwb3J0U2hpZnQpIHtcblxuICAgICAgICByZXR1cm47XG5cbiAgICB9IC8vIGVuZCBpZiAoaXNBU2hpZnRLZXkgJiYgIXYucmVwb3J0U2hpZnQpXG4gICAgXG4gICAgdmFyIHRoaXNDaCA9IGYuZ2V0S2V5Q29kZSAod2hpY2gpO1xuXG4gICAgdmFyIGNoT2IgPSAoe1xuICAgICAgICBzaGlmdDogdi5rU2hpZnQsXG4gICAgICAgIGN0cmw6IHYua0N0cmwsXG4gICAgICAgIGFsdDogdi5rQWx0LFxuICAgICAgICBtYWNDbWQ6IHYua0NtZCxcbiAgICAgICAgd2hpY2g6IHdoaWNoLFxuICAgICAgICBjaDogdGhpc0NoLFxuICAgICAgICBpc0FTaGlmdEtleTogaXNBU2hpZnRLZXksXG4gICAgfSk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyAoJ2NoT2I6ICcgKyBKU09OLnN0cmluZ2lmeSAoY2hPYikgKyAnXFxuJyk7XG4gICAgLypcbiAgICBpZiAodi5yZXBvcnRTaGlmdCkge1xuXG4gICAgICAgIGNoT2IuaXNBU2hpZnRLZXkgPSBpc0FTaGlmdEtleTsgIFxuICAgICAgICAgICAgLy8gdHJ1ZSBpZiBhbnkgb2Y6IHNoaWZ0LCBjdHJsLCBhbHQsIG9yIG1hY0NtZCBhcmUgdHJ1ZVxuICAgICAgICAgICAgLy8gb25seSByZWxldmFudCBpZiB2LnJlcG9ydFNoaWZ0IGlzIHRydWVcblxuICAgIH0gLy8gZW5kIGlmICh2LnJlcG9ydFNoaWZ0KVxuICAgICovXG5cbiAgICBjYWxsYmFjayAoY2hPYik7XG5cbn07IC8vIGVuZCBmLmNLZXlVcERvd25GaW5pc2ggXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuZGVmYXVsdEhhbmRsZXIgPSAoY2hPYikgPT4ge1xuICAgIFxuICAgIHZhciBjaE9iUyA9IEpTT04uc3RyaW5naWZ5IChjaE9iKTtcbiAgICBjb25zb2xlLmxvZyAoJ2dvLWtleS5kZWZhdWx0SGFuZGxlci5jaE9iOiAnICsgY2hPYlMpO1xuXG59OyAvLyBlbmQgZi5kZWZhdWx0SGFuZGxlciBcblxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmdldEtleUNvZGUgPSAod2hpY2gpID0+IHtcbiAgICBcblxuICAgIHZhciBjaDtcblxuICAgIGlmICh2LmN0cmxPck5vbkFzY2lpLmhhc093blByb3BlcnR5ICh3aGljaCkpIHtcblxuICAgICAgICBjaCA9IHYuY3RybE9yTm9uQXNjaWkgW3doaWNoXTtcblxuICAgIH0gZWxzZSBpZiAodi5rU2hpZnQgJiYgdi5hc2NpaVNoaWZ0ZWQuaGFzT3duUHJvcGVydHkgKHdoaWNoKSkge1xuXG4gICAgICAgIGNoID0gdi5hc2NpaVNoaWZ0ZWQgW3doaWNoXTtcblxuICAgIH0gZWxzZSBpZiAoIXYua1NoaWZ0ICYmIHYuYXNjaWlVblNoaWZ0ZWQuaGFzT3duUHJvcGVydHkgKHdoaWNoKSkge1xuXG4gICAgICAgIGNoID0gdi5hc2NpaVVuU2hpZnRlZCBbd2hpY2hdO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBjaCA9IG51bGw7XG5cbiAgICB9IC8vIGVuZCBpZiBcblxuICAgIHJldHVybiBjaDtcblxufTsgLy8gZW5kIGYuZ2V0S2V5Q29kZSBcblxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmluaXRLZXlEb3duID0gKGpxU2VsZWN0b3IpID0+IHtcbiAgICBcbiAgICAkKGpxU2VsZWN0b3IpXG4gICAgLm9mZigna2V5ZG93bicpXG4gICAgLmtleWRvd24gKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nICgnID09PiBpbml0S2V5RG93bicpO1xuICAgICAgICBmLmNLZXlEb3duIChldmVudCk7XG4gICAgfSk7XG5cbn07IC8vIGVuZCBmLmluaXRLZXlEb3duIFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmluaXRLZXlVcCA9IChqcVNlbGVjdG9yKSA9PiB7XG4gICAgXG4gICAgJChqcVNlbGVjdG9yKVxuICAgIC5vZmYoJ2tleXVwJylcbiAgICAua2V5dXAgKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nICgnID09PiBpbml0S2V5VXAnKTtcbiAgICAgICAgZi5jS2V5VXAgKGV2ZW50KTtcbiAgICB9KTtcblxufTsgLy8gZW5kIGYuaW5pdEtleVVwIFxuXG5cblxuLy8gUFVCTElDIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIFAgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuYWxsS2V5c09mZiA9ICgpID0+IHtcbiAgICBcbiAgICB2YXIga2V5RXZlbnRzID0gX20wLmtleUV2ZW50cztcbiAgICB2YXIga2V5U2VscyA9IE9iamVjdC5rZXlzIChrZXlFdmVudHMpO1xuXG4gICAga2V5U2Vscy5mb3JFYWNoIChmdW5jdGlvbiAoZWwpIHtcblxuICAgICAgICBrZXlFdmVudHMgW2VsXS5vZmYgKCk7XG4gICAgfSk7XG5cbn07IC8vIGVuZCBQLmFsbEtleXNPZmZcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5hbGxLZXlzT24gPSAoKSA9PiB7XG4gICAgXG4gICAgdmFyIGtleUV2ZW50cyA9IF9tMC5rZXlFdmVudHM7XG4gICAgdmFyIGtleVNlbHMgPSBPYmplY3Qua2V5cyAoa2V5RXZlbnRzKTtcblxuICAgIGtleVNlbHMuZm9yRWFjaCAoZnVuY3Rpb24gKGVsKSB7XG5cbiAgICAgICAga2V5RXZlbnRzIFtlbF0ub24gKCk7XG4gICAgfSk7XG5cbn07IC8vIGVuZCBQLmFsbEtleXNPblxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLnNldEtleU9mZiA9ICgpID0+IHtcbiAgICBcbiAgICAgICAgLy9jb25zb2xlLmxvZyAoJ1NFVEtFWU9GRiBnby1rZXkuc2V0S2V5T2ZmICAgICBqcVNlbGVjdG9yID0gJyArIHYuanFTZWxlY3Rvcik7XG4gICAgJCh2LmpxU2VsZWN0b3IpXG4gICAgLm9mZiAoJ2tleWRvd24nKVxuICAgIC5vZmYgKCdrZXl1cCcpO1xuXG59OyAvLyBlbmQgUC5zZXRLZXlPZmZcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9QLnNldEtleU9uID0gKGpxU2VsKSA9PiB7XG5QLnNldEtleU9uID0gKCkgPT4ge1xuICAgIFxuICAgICAgICAvL2NvbnNvbGUubG9nICgnU0VUS0VZT04gZ28ta2V5LnNldEtleU9uICAganFTZWxlY3RvciA9ICcgKyB2LmpxU2VsZWN0b3IpO1xuICAgIC8vZi5pbml0S2V5VXAgKGpxU2VsKTtcbiAgICAvL2YuaW5pdEtleURvd24gKGpxU2VsKTtcbiAgICBmLmluaXRLZXlVcCAodi5qcVNlbGVjdG9yKTtcbiAgICBmLmluaXRLZXlEb3duICh2LmpxU2VsZWN0b3IpO1xuXG59OyAvLyBlbmQgUC5zZXRLZXlIYW5kbGVyXG5cbi8vIGVuZCBQVUJMSUMgc2VjdGlvblxuXG5mLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59O1xuIiwiLy8gZ28tbXNnL2luZGV4LmpzXG4vLyBnby1tc2cgb2JqZWN0IGhhcyBhIHVuaXF1ZSBwcmltYXJ5IG1zZyBhbmQgemVybyBvciBtb3JlIG9wdGlvbmFsIGF0dHJpYnV0ZXNcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwMCkge1xuXG4gICAgLy8gUFJJVkFURSBQcm9wZXJ0aWVzXG52YXIgdiA9IHtcblxuICAgIHByaW1hcnk6IG51bGwsXG4gICAgICAgIC8vIHByaW1hcnk6IHtjbWQ6IDF9IChjb250YWlucyBvcHRpb25hbCBjb250ZW50KSBvciB7Y21kOiAwfSAobm8gb3B0aW9uYWwgY29udGVudCBhbGxvd2VkKVxuXG4gICAgc2Vjb25kYXJ5OiBudWxsLFxuICAgICAgICAvLyBpZiBhIHByaW1hcnkgbWVzc2FnZSBoYXMgYW4gb3B0aW9uYWwgYXR0cmlidXRlIHRoYXQgY29uY2lkZW50YWxseSBpcyB0aGUgc2FtZSBhc1xuICAgICAgICAvLyBhbm90aGVyIHByaW1hcnkgbWVzc2FnZSwgaXQgc2hvdWxkIGJlIGhhdmUgYSBrZXkvdmFsdWUgcGFpciBpbiBzZWNvbmRhcnkge2F0dHI6IDF9XG4gICAgICAgIC8vIHRvIGVuc3VyZSB0aGF0IGl0IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiBhdHRyaWJ1dGUgaW4gY2FzZSBhIHByaW1hcnkgaXMgcHJlc2VudFxuICAgICAgICAvLyBTZWNvbmRhcnkgaXMgb25seSB0ZXN0ZWQgaWYgdGhlcmUgZXhpc3RzIGEgcHJpbWFyeSBrZXlcblxuICAgIG1ldGE6IG51bGwsXG4gICAgICAgIC8vIG1ldGEgcGFyYW1ldGVycyBpbnRlbmRlZCBmb3IgY3RybCBvciBvdGhlciBwdXJwb3NlIG91dHNpZGUgb2YgcHJpbWFyeSBhbmQgc2Vjb25kYXJ5IG1zZ1xuICAgICAgICAvLyBwYXJhbWV0ZXIgdXNhZ2VcblxufTsgIC8vIGVuZCBQUklWQVRFIHByb3BlcnRpZXNcblxuICAgIC8vIFBSSVZBVEUgRnVuY3Rpb25zXG5mID0ge307XG5cblxuZi5pbml0ID0gKCkgPT4ge1xuXG4gICAgdi5wcmltYXJ5ID0gcDAucHJpbWFyeTtcbiAgICB2LnNlY29uZGFyeSA9IHAwLmhhc093blByb3BlcnR5ICgnc2Vjb25kYXJ5JykgPyBwMC5zZWNvbmRhcnkgOiB7fTtcbiAgICB2Lm1ldGEgPSBwMC5oYXNPd25Qcm9wZXJ0eSAoJ21ldGEnKSA/IHAwLm1ldGEgOiB7fTtcbn07XG5cbiAgICAvLyBQVUJMSUMgRnVuY3Rpb25zXG52YXIgUCA9IHt9O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5wYXJzZU1zZyA9IChtc2dPYikgPT4ge1xuICAgIFxuICAgIHZhciByZXMgPSB7fTtcbiAgICB2YXIgbXNnS2V5cyA9IE9iamVjdC5rZXlzIChtc2dPYik7XG5cbiAgICB2YXIgcHJpbWFyeUNhbmRpZGF0ZXNPYiA9IHt9O1xuICAgIHZhciBhdHRyc09iID0ge307XG4gICAgdmFyIG1ldGFPYiA9IHt9O1xuXG4gICAgdmFyIGtleTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1zZ0tleXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICBrZXkgPSBtc2dLZXlzIFtpXTtcbiAgICAgICAgXG4gICAgICAgIGlmICh2LnByaW1hcnkuaGFzT3duUHJvcGVydHkgKGtleSkpIHtcblxuICAgICAgICAgICAgcHJpbWFyeUNhbmRpZGF0ZXNPYiBba2V5XSA9IDE7XG5cbiAgICAgICAgfSBlbHNlIGlmICh2Lm1ldGEuaGFzT3duUHJvcGVydHkgKGtleSkpIHtcblxuICAgICAgICAgICAgbWV0YU9iIFtrZXldID0gbXNnT2IgW2tleV07XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgYXR0cnNPYiBba2V5XSA9IG1zZ09iIFtrZXldO1xuXG4gICAgICAgIH0gLy8gZW5kIGlmICh2LnByaW1hcnkuaGFzT3duUHJvcGVydHkgKGtleSkpXG4gICAgICAgIFxuICAgIH0gLy8gZW5kIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnS2V5cy5sZW5ndGg7IGkrKylcblxuICAgIHZhciBwcmltYXJ5Q2FuZGlkYXRlc0EgPSBPYmplY3Qua2V5cyAocHJpbWFyeUNhbmRpZGF0ZXNPYik7XG5cbiAgICB2YXIgcHJpbWFyeUtleTtcbiAgICB2YXIgY29udGVudDtcblxuICAgIGlmIChwcmltYXJ5Q2FuZGlkYXRlc0EubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgcHJpbWFyeUtleSA9IG51bGw7XG5cbiAgICB9IGVsc2UgaWYgKHByaW1hcnlDYW5kaWRhdGVzQS5sZW5ndGggPT09IDEpIHtcblxuICAgICAgICBwcmltYXJ5S2V5ID0gcHJpbWFyeUNhbmRpZGF0ZXNBIFswXTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGhhbmRsZSBwcmltYXJ5L3NlY29uZGFyeSBrZXkgcmVzb2x1dGlvblxuXG4gICAgICAgIHByaW1hcnlLZXkgPSBudWxsO1xuICAgICAgICBmb3IgKGtleSBpbiBwcmltYXJ5Q2FuZGlkYXRlc09iKSB7XG5cbiAgICAgICAgICAgIGlmICh2LnNlY29uZGFyeS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSkge1xuXG4gICAgICAgICAgICAgICAgYXR0cnNPYiBba2V5XSA9IG1zZ09iIFtrZXldO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKHByaW1hcnlLZXkgPT09IG51bGwpIHtcblxuICAgICAgICAgICAgICAgICAgICBwcmltYXJ5S2V5ID0ga2V5O1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICByZXMuZXJyID0gJ011bHRpcGxlIHByaW1hcnkga2V5cyBmb3VuZCBub3QgaW4gc2Vjb25kYXJ5IG9iamVjdDogJyArIEpTT04uc3RyaW5naWZ5IChtc2cpO1xuXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgKHByaW1hcnlLZXkgPT09IG51bGwpXG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIH0gLy8gZW5kIGlmICh2LnNlY29uZGFyeS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSlcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9IC8vIGVuZCBpZiAocHJpbWFyeUNhbmRpZGF0ZXNBLmxlbmd0aCA9PT0gMClcblxuXG4gICAgaWYgKCFyZXMuaGFzT3duUHJvcGVydHkgKCdlcnInKSkge1xuXG4gICAgICAgIHJlcy5wID0gcHJpbWFyeUtleTtcbiAgICAgICAgcmVzLmMgPSBwcmltYXJ5S2V5ICYmIHYucHJpbWFyeSBbcHJpbWFyeUtleV0gIT09IDAgPyBtc2dPYiBbcHJpbWFyeUtleV0gOiBudWxsO1xuICAgICAgICAgICAgLy8gZXhhbXBsZSB2b2lkIGh0bWwgdGFnIGhhcyB6ZXJvIGNvbnRlbnQsIHNvIGNvbnRlbnQgaXMgZm9yY2VkIHRvIG51bGxcblxuICAgICAgICByZXMucyA9IGF0dHJzT2I7XG4gICAgICAgIHJlcy5tID0gbWV0YU9iO1xuXG4gICAgfSAvLyBlbmQgaWYgKCFyZXMuaGFzT3duUHJvcGVydHkgKCdlcnInKSlcbiAgICBcbiAgICBcbiAgICByZXR1cm4gcmVzO1xuXG59OyAvLyBlbmQgUC5wYXJzZU1zZyBcblxuXG5cbiAgICAvLyBlbmQgUFVCTElDIEZ1bmN0aW9uc1xuXG5mLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59O1xuXG5cblxuIiwiLy8gaW5kZXgwLmpzXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeSAoKCkgPT4ge1xuICAgICAgICByZXF1aXJlICgncnBuLmpzJyk7XG4gICAgfSlcbn0oKSlcblxuIiwiLy8gcnBuLmpzXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIC8vIFBSSVZBVEUgUHJvcGVydGllc1xudmFyIHYgPSB7XG5cbiAgICBqMmg6IHJlcXVpcmUgKCdnby1qMmgnKSxcbiAgICBkcHA6IG51bGwsXG4gICAgZ2VuSWRzOiBudWxsLFxuXG4gICAgSWRTdGFjazogbnVsbCxcbiAgICBJZEJ1dHRvbnM6IHt9LFxuXG4gICAga3kwOiByZXF1aXJlICgnZ28ta2V5JyksXG4gICAgSWRSZ3N0cnM6IFtdLFxuICAgIHN0YWNrOiBbXSxcblxuICAgIGVkaXRpbmdYOiBmYWxzZSxcblxuICAgIGtleU1hcDoge1xuICAgICAgICAnYic6ICdicycsXG4gICAgICAgICdjJzogJ2NocycsXG4gICAgICAgICdkJzogJ2Ryb3AnLFxuICAgICAgICAnZSc6ICdlZXgnLFxuICAgICAgICAnbCc6ICdsYXN0JyxcbiAgICAgICAgJ3MnOiAnc3dhcCcsXG4gICAgfSxcblxuICAgIGxhc3Q6IFtdLFxuXG59O1xuICAgIC8vIFBSSVZBVEUgRnVuY3Rpb25zXG52YXIgZiA9IHt9O1xuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmluaXQgPSAoKSA9PiB7XG5cbiAgICB2LmRwcCA9IHYuajJoLmRpc3BsYXlPYkE7XG4gICAgdi5nZW5JZHMgPSB2LmoyaC5nZW5JZHM7XG5cbiAgICBmLnJlbmRlciAoKTtcblxuICAgIHYua3kgPSBuZXcgdi5reTAgKCdib2R5JywgZmFsc2UsIGYua2V5RG93bik7XG4gICAgZi5jbGlja3MgKCk7XG4gICAgXG59O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5hY3Rpb24gPSAoa2V5KSA9PiB7XG4gICAgXG4gICAgICAgIC8vIC0tLS0gIGFjdGlvbkJpbmFyeSAtLS0tXG4gICAgdmFyIGFjdGlvbkJpbmFyeSA9IGZ1bmN0aW9uIChvcCkge1xuXG4gICAgICAgICAgICAvLyAtLS0tICBkb0JpbmFyeU9wIC0tLS1cbiAgICAgICAgdmFyIGRvQmluYXJ5T3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgICAgICAgICB2YXIgcmVzO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIG5vdyB0aGF0IHRoZSB4LHkgdmFsdWVzIGhhdmUgYmVlbiB2YWxpZGF0ZWQsIHJlbW92ZSBmcm9tIHN0YWNrXG4gICAgICAgICAgICB2LnN0YWNrLnNoaWZ0ICgpO1xuICAgICAgICAgICAgdi5zdGFjay5zaGlmdCAoKTtcbiAgICBcbiAgICAgICAgICAgIHN3aXRjaCAob3ApIHtcbiAgICBcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgcmVzID0geVZhbCArIHhWYWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgIFxuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgIFxuICAgICAgICAgICAgICAgICAgICByZXMgPSB5VmFsIC0geFZhbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgXG4gICAgICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IHlWYWwgKiB4VmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICBcbiAgICAgICAgICAgICAgICBjYXNlICcvJzpcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgcmVzID0geVZhbCAvIHhWYWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgIFxuICAgICAgICAgICAgfSAvLyBlbmQgc3dpdGNoIChvcClcbiAgICAgICAgICAgIFxuICAgIFxuICAgICAgICAgICAgaWYgKG9wID09PSAnc3dhcCcpIHtcbiAgICBcbiAgICAgICAgICAgICAgICB2LnN0YWNrLnVuc2hpZnQgKHhWYWwwKTtcbiAgICAgICAgICAgICAgICB2LnN0YWNrLnVuc2hpZnQgKHlWYWwwKTtcbiAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgXG4gICAgICAgICAgICAgICAgdi5zdGFjay51bnNoaWZ0IChKU09OLnN0cmluZ2lmeSAocmVzKSk7XG4gICAgXG4gICAgICAgICAgICAgICAgdi5sYXN0ID0gW107XG4gICAgICAgICAgICAgICAgdi5sYXN0LnVuc2hpZnQgKHhWYWwwKTtcbiAgICAgICAgICAgICAgICB2Lmxhc3QudW5zaGlmdCAoeVZhbDApO1xuICAgIFxuICAgIFxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgKG9wID09PSAnc3dhcCcpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHYuZWRpdGluZ1ggPSBmYWxzZTtcbiAgICAgICAgICAgIFxuICAgICAgICB9OyAgLy8gZW5kIGRvQmluYXJ5T3BcbiAgICBcbiAgICBcbiAgICAgICAgICAgLy8gLS0tLSBtYWluIC0tLS1cbiAgICAgICAgaWYgKHYuc3RhY2subGVuZ3RoID49IDIpIHtcbiAgICBcbiAgICAgICAgICAgIHZhciB4VmFsLCB5VmFsO1xuICAgIFxuICAgICAgICAgICAgdmFyIHhWYWwwID0gdi5zdGFjayBbMF07XG4gICAgICAgICAgICB2YXIgeVZhbDAgPSB2LnN0YWNrIFsxXTtcbiAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgeFZhbCA9IEpTT04ucGFyc2UgKHhWYWwwKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB5VmFsID0gSlNPTi5wYXJzZSAoeVZhbDApO1xuICAgICAgICAgICAgICAgICAgICBkb0JpbmFyeU9wICgpO1xuICAgIFxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgIFxuICAgIFxuICAgICAgICB9IC8vIGVuZCBpZiAodi5zdGFjay5sZW5ndGggPj0gMilcbiAgICAgICAgXG4gICAgfTsgIC8vIGVuZCBhY3Rpb25CaW5hcnkgXG5cblxuXG4gICAgICAgIC8vIC0tLS0gIGFjdGlvbkJTIC0tLS1cbiAgICB2YXIgYWN0aW9uQlMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHhWYWwgPSB2LnN0YWNrIFswXTtcblxuICAgICAgICBpZiAodi5lZGl0aW5nWCkge1xuXG4gICAgICAgICAgICB4VmFsID0geFZhbC5zbGljZSAoMCwgLTEpO1xuICAgICAgICAgICAgaWYgKHhWYWwubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICBhY3Rpb25Ecm9wICgpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdi5zdGFjayBbMF0gPSB4VmFsO1xuXG4gICAgICAgICAgICB9IC8vIGVuZCBpZiAoeFZhbC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICBcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBhY3Rpb25Ecm9wICgpO1xuXG4gICAgICAgIH0gLy8gZW5kIGlmICh2LmVkaXRpbmdYKVxuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGFjdGlvbkJTXG5cblxuICAgICAgICAvLyAtLS0tICBhY3Rpb25DaHMgLS0tLVxuICAgIHZhciBhY3Rpb25DaHMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHJlcztcblxuICAgICAgICB2YXIgeFZhbCA9IHYuc3RhY2sgWzBdO1xuXG4gICAgICAgIGlmICh2LmVkaXRpbmdYICYmIHhWYWwubWF0Y2ggKC9FLykpIHtcblxuICAgICAgICAgICAgcmVzID0geFZhbC5tYXRjaCAoL0UtLykgPyB4VmFsLnJlcGxhY2UgKC9FLS8sICdFJykgOiB4VmFsLnJlcGxhY2UgKC9FLywgJ0UtJyk7XG5cbiAgICAgICAgfSBlbHNlIGlmICh4VmFsLnN1YnN0cmluZyAoMCwgMSkgPT09ICctJykge1xuXG4gICAgICAgICAgICByZXMgPSB4VmFsLnN1YnN0cmluZyAoMSk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgcmVzID0gJy0nICsgeFZhbDtcblxuICAgICAgICB9IC8vIGVuZCBpZiAodi5lZGl0aW5nWCAmJiB4VmFsLm1hdGNoICgvRS8pKVxuXG4gICAgICAgIHYuc3RhY2sgWzBdID0gcmVzO1xuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGFjdGlvbkNoc1xuXG5cbiAgICAgICAgLy8gLS0tLSAgYWN0aW9uRHJvcCAtLS0tXG4gICAgdmFyIGFjdGlvbkRyb3AgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYgKHYuc3RhY2subGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICB2Lmxhc3QgPSBbdi5zdGFjay5zaGlmdCAoKV07XG5cbiAgICAgICAgfSAvLyBlbmQgaWYgKHYuc3RhY2subGVuZ3RoID4gMClcbiAgICAgICAgXG4gICAgfTsgIC8vIGVuZCBhY3Rpb25Ecm9wXG5cblxuICAgICAgICAvLyAtLS0tICBhY3Rpb25FbnRlciAtLS0tXG4gICAgdmFyIGFjdGlvbkVudGVyID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciB4VmFsMCA9IHYuc3RhY2sgWzBdO1xuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgICAgICAvLyBubyBuZWVkIHRvIGdldCByZXR1cm4gZnJvbSBwYXJzZS4gT25seSBuZWVkZWQgdG8gdGVzdCBpZiBzdHIgcmVwcmVzZW50cyBhIG51bWJlclxuICAgICAgICAgICAgSlNPTi5wYXJzZSAoeFZhbDApO1xuXG4gICAgICAgICAgICBpZiAodi5lZGl0aW5nWCkge1xuICAgIFxuICAgICAgICAgICAgICAgIHYuZWRpdGluZ1ggPSBmYWxzZTtcbiAgICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgXG4gICAgICAgICAgICAgICAgdi5zdGFjay51bnNoaWZ0ICh2LnN0YWNrIFswXSk7ICAgXG4gICAgXG4gICAgICAgICAgICB9IC8vIGVuZCBpZiAodi5lZGl0aW5nWClcblxuICAgICAgICAgICAgdi5sYXN0ID0gW107XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgIH07ICAvLyBlbmQgYWN0aW9uRW50ZXJcblxuXG4gICAgICAgIC8vIC0tLS0gIGFjdGlvbk51bSAtLS0tXG4gICAgdmFyIGFjdGlvbk51bSA9IGZ1bmN0aW9uIChrZXkwKSB7XG5cbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgXG4gICAgICAgIGlmICh2LmVkaXRpbmdYKSB7XG4gICAgXG4gICAgICAgICAgICBrZXkgPSBrZXkwID09PSAnZWV4JyA/ICdFJyA6IGtleTA7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gVE9ETyBkb3RFbnRlcmVkIG9ubHkgb25jZVxuICAgICAgICAgICAgdi5zdGFjayBbMF0gKz0ga2V5O1xuICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgXG4gICAgICAgICAgICBrZXkgPSBrZXkwID09PSAnZWV4JyA/ICcxRScgOiBrZXkwO1xuICAgICAgICAgICAgdi5lZGl0aW5nWCA9IHRydWU7XG4gICAgICAgICAgICB2LnN0YWNrLnVuc2hpZnQgKGtleSk7XG4gICAgICAgIFxuICAgICAgICB9IC8vIGVuZCBpZiAodi5lZGl0aW5nWClcbiAgICBcbiAgICB9OyAgLy8gZW5kIGFjdGlvbk51bSBcblxuXG4gICAgICAgIC8vIC0tLS0gIGFjdGlvblJlc3RvcmUgLS0tLVxuICAgIHZhciBhY3Rpb25SZXN0b3JlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlmICh2Lmxhc3QubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgLy8gaWYgYmluYXJ5IG9wLCByZW1vdmUgdGhlIHggdmFsdWUgYmVmb3JlIHVuc2hpZnRpbmcgeSBhbmQgeFxuXG4gICAgICAgICAgICB2LnN0YWNrLnNoaWZ0ICgpO1xuXG4gICAgICAgIH0gLy8gZW5kIGlmICh2Lmxhc3QubGVuZ3RoID4gMSlcbiAgICAgICAgXG4gICAgICAgIHdoaWxlICh2Lmxhc3QubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgICB2LnN0YWNrLnVuc2hpZnQgKHYubGFzdC5zaGlmdCAoKSk7XG5cbiAgICAgICAgfSAvLyBlbmQgd2hpbGUgKHYubGFzdC5sZW5ndGggPiAwKVxuICAgICAgICBcbiAgICAgICAgXG4gICAgfTsgIC8vIGVuZCBhY3Rpb25SZXN0b3JlXG5cblxuXG5cbiAgICAgICAvLyAtLS0tIG1haW4gLS0tLVxuICAgIHN3aXRjaCAoa2V5KSB7XG5cbiAgICAgICAgY2FzZSAnMSc6XG4gICAgICAgIGNhc2UgJzInOlxuICAgICAgICBjYXNlICczJzpcbiAgICAgICAgY2FzZSAnNCc6XG4gICAgICAgIGNhc2UgJzUnOlxuICAgICAgICBjYXNlICc2JzpcbiAgICAgICAgY2FzZSAnNyc6XG4gICAgICAgIGNhc2UgJzgnOlxuICAgICAgICBjYXNlICc5JzpcbiAgICAgICAgY2FzZSAnMCc6XG4gICAgICAgIGNhc2UgJy4nOlxuICAgICAgICBjYXNlICdlZXgnOlxuXG4gICAgICAgICAgICBhY3Rpb25OdW0gKGtleSk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdjaHMnOlxuXG4gICAgICAgICAgICBhY3Rpb25DaHMgKCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgY2FzZSAneCc6XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgY2FzZSAnLyc6XG5cbiAgICAgICAgICAgIGFjdGlvbkJpbmFyeSAoa2V5KTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2VudGVyJzpcblxuICAgICAgICAgICAgYWN0aW9uRW50ZXIgKCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdicyc6XG4gICAgICAgIGNhc2UgJ2JhY2tzcGFjZSc6XG5cbiAgICAgICAgICAgIGFjdGlvbkJTICgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICBjYXNlICdkcm9wJzpcblxuICAgICAgICAgICAgYWN0aW9uRHJvcCAoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ3N3YXAnOlxuXG4gICAgICAgICAgICBhY3Rpb25CaW5hcnkgKCdzd2FwJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGNhc2UgJ2xhc3QnOlxuXG4gICAgICAgICAgICBhY3Rpb25SZXN0b3JlICgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfSAvLyBlbmQgc3dpdGNoIChrZXkpXG4gICAgXG4gICAgZi51cGRhdGVTdGFjayAoKTtcblxufTsgLy8gZW5kIGYuYWN0aW9uIFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmJpbmFyeU9wID0gKG9wKSA9PiB7XG4gICAgXG4gICAgXG5cbn07IC8vIGVuZCBmLmJpbmFyeU9wIFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmNsaWNrcyA9ICgpID0+IHtcbiAgICBcbiAgICBmb3IgKHZhciBrZXkgaW4gdi5JZEJ1dHRvbnMpIHtcblxuICAgICAgICB2YXIgSWQgPSB2LklkQnV0dG9ucyBba2V5XTtcblxuICAgICAgICAkKElkKVxuICAgICAgICAuY2xpY2sgKChldmVudCkgPT4ge1xuICAgICAgICAgICAgdmFyIGtleSA9ICQoJyMnICsgZXZlbnQudGFyZ2V0LmlkKS50ZXh0ICgpO1xuICAgICAgICAgICAga2V5ID0ga2V5ID09PSAnYicgPyAnQlMnIDoga2V5O1xuXG4gICAgICAgICAgICBmLmFjdGlvbiAoa2V5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59OyAvLyBlbmQgZi5jbGlja3NcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5rZXlEb3duID0gKGtleU9iKSA9PiB7XG4gICAgXG4gICAgdmFyIGtleSA9IGtleU9iLmNoLnRvTG93ZXJDYXNlICgpO1xuXG4gICAga2V5ID0gdi5rZXlNYXAuaGFzT3duUHJvcGVydHkgKGtleSkgPyB2LmtleU1hcCBba2V5XSA6IGtleTtcblxuICAgIGYuYWN0aW9uIChrZXkpO1xuXG59OyAvLyBlbmQgZi5rZXlEb3duIFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLnJlbmRlciA9ICgpID0+IHtcbiAgICBcbiAgICAgICAgLy8gLS0tLSAgYnV0dG9uT2JzICAtLS0tXG4gICAgdmFyIGJ1dHRvbk9icyA9IGZ1bmN0aW9uICh2YWxzLCBwYXJlbnQpIHtcblxuICAgICAgICByZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaXggPSAwOyBpeCA8IHZhbHMubGVuZ3RoOyBpeCsrKSB7XG5cbiAgICAgICAgICAgIHZhciB2YWwgPSB2YWxzIFtpeF07XG4gICAgICAgICAgICB2YWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IHZhbCA6IEpTT04uc3RyaW5naWZ5ICh2YWwpO1xuXG4gICAgICAgICAgICB2YXIgSWRzID0gdi5nZW5JZHMgKCk7XG4gICAgICAgICAgICB2YXIgaWQgPSBJZHMgWzBdO1xuICAgICAgICAgICAgdi5JZEJ1dHRvbnMgW3ZhbF0gPSBJZHMgWzFdO1xuICAgIFxuICAgICAgICAgICAgdmFyIGNsYXNzU3RyID0gJ2J0biBidG4tc20gbXItMSc7XG4gICAgICAgICAgICBjbGFzc1N0ciArPSAnIG91dGxpbmUtbnVtJztcbiAgICAgICAgICAgIGNsYXNzU3RyICs9IHZhbC5sZW5ndGggPT09IDEgPyAnIHdpZHRoMjYnIDogXCJcIjtcbiAgICBcbiAgICAgICAgICAgIHJlcy5wdXNoICh7YnV0dG9uOiB2YWwsIGlkOiBpZCwgY2xhc3M6IGNsYXNzU3RyfSk7XG5cbiAgICAgICAgfSAvLyBlbmQgZm9yICh2YXIgaXggPSAwOyBpeCA8IHZhbHMubGVuZ3RoOyBpeCsrKVxuICAgICAgICBcbiAgICAgICAgcmVzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgcmV0dXJuIHJlcztcblxuICAgIH07ICAvLyBlbmQgYnV0dG9uT2JzICBcblxuXG4gICAgICAgLy8gLS0tLSBtYWluIC0tLS1cbiAgICBmLnJlbmRlclN0eWxlICgpO1xuXG4gICAgdmFyIElkUm9vdCA9IHYuZHBwICh7ZGl2OjAsIGNsYXNzOiAnY29udGFpbmVyIG10LTMnfSk7XG4gICAgdmFyIGxvZ28gPSB7aW1nOiAwLCBjbGFzczogJ2QtYmxvY2sgbWItMScsIHNyYzogJ0ltYWdlcy9SUE5DYWxjLnBuZycsIHBhcmVudDogSWRSb290fTtcbiAgICB2YXIgc3hzdyA9IHtpbWc6IDAsIGNsYXNzOiAnZC1ibG9jayB3aWR0aHMgbWItMycsIHNyYzogJ0ltYWdlcy9zeHN3MjAxMC5wbmcnLCBwYXJlbnQ6IElkUm9vdH07XG4gICAgdmFyIHN0YWNrID0ge2RpdjogMCwgY2xhc3M6ICdib3JkZXIgYm9yZGVyLXByaW1hcnkgcm91bmRlZCB3LTUwIG1iLTIgaGVpZ2h0MjQnLCBwYXJlbnQ6IElkUm9vdH07XG4vLyAgICB2YXIgbnVtYmVycyA9IHtkaXY6IDAsIGNsYXNzOiAnJ31cblxuICAgICAgICAvLyBzdGFja1xuICAgIHYuSWRTdGFjayA9IHYuZHBwIChbbG9nbywgc3hzdywgc3RhY2tdKVsyXTtcblxuICAgIHZhciByZ3N0ckxhYmVscyA9IFsneCcsICd5JywgJ3onLCAndCddO1xuICAgIHJnc3RyTGFiZWxzLmZvckVhY2ggKGZ1bmN0aW9uIChsYWJlbCkge1xuXG4gICAgICAgIHZhciBJZHMgPSB2LmdlbklkcyAoKTtcblxuICAgICAgICB2LklkUmdzdHJzLnB1c2ggKElkcyBbMV0pO1xuXG4gICAgICAgIHZhciByZ3N0ckRpc3AgPSB7ZGl2OiBbXG4gICAgICAgICAgICB7bGFiZWw6IGxhYmVsICsgJzonICsgJyZuYnNwOyZuYnNwOycsIGNsYXNzOiAndGV4dC1wcmltYXJ5IG1sLTEgbWItMCd9LFxuICAgICAgICAgICAge3NwYW46IDAsIGlkOiBJZHMgWzBdfVxuICAgICAgICBdLCBwcmVwZW5kOiAxLCBwYXJlbnQ6IHYuSWRTdGFja307XG5cbiAgICAgICAgdi5kcHAgKHJnc3RyRGlzcCk7XG4gICAgICAgIFxuICAgIH0pO1xuXG5cbiAgICAgICAgLy8gbnVtYmVyc1xuICAgIHZhciBidG5EaXYgPSB7ZGl2OiAwLCBjbGFzczogJ2QtaW5saW5lLWJsb2NrIGFsaWduLXRvcCBtci0zJywgcGFyZW50OiBJZFJvb3R9O1xuXG4gICAgdmFyIElkTnVtYmVycyA9IHYuZHBwIChidG5EaXYpO1xuICAgIFxuICAgIHZhciBidG5Hcm91cCA9IHtkaXY6MCwgY2xhc3M6ICdtYi0xJywgcGFyZW50OiBJZE51bWJlcnN9O1xuXG4gICAgdmFyIElkMTIzID0gdi5kcHAgKGJ0bkdyb3VwKTtcbiAgICB2LmRwcCAoYnV0dG9uT2JzIChbMSwyLDNdLCBJZDEyMykpO1xuXG4gICAgdmFyIElkNDU2ID0gdi5kcHAgKGJ0bkdyb3VwKTtcbiAgICB2LmRwcCAoYnV0dG9uT2JzIChbNCw1LDZdLCBJZDQ1NikpO1xuXG4gICAgdmFyIElkNzg5ID0gdi5kcHAgKGJ0bkdyb3VwKTtcbiAgICB2LmRwcCAoYnV0dG9uT2JzIChbNyw4LDldLCBJZDc4OSkpO1xuXG4gICAgdmFyIElkMCA9IHYuZHBwIChidG5Hcm91cCk7XG4gICAgdmFyIHplcm9zRG90ID0gYnV0dG9uT2JzIChbJ2InLCAwLCAnLiddLCBJZDApO1xuXG4gICAgdi5kcHAgKHplcm9zRG90KTtcblxuXG4gICAgICAgIC8vICsgeCAtIC8gRW50ZXJcbiAgICB2YXIgSWRPcHMxID0gdi5kcHAgKGJ0bkRpdik7XG4gICAgYnRuR3JvdXAucGFyZW50ID0gSWRPcHMxO1xuXG4gICAgdmFyIElkQWRkTXVsdCA9IHYuZHBwIChidG5Hcm91cCk7XG4gICAgdi5kcHAgKGJ1dHRvbk9icyAoWycrJywgJ3gnXSwgSWRBZGRNdWx0KSk7XG5cbiAgICB2YXIgSWRTdWJEaXYgPSB2LmRwcCAoYnRuR3JvdXApO1xuICAgIHYuZHBwIChidXR0b25PYnMgKFsnLScsICcvJ10sIElkU3ViRGl2KSk7XG5cbiAgICB2YXIgSWRFbnRlciA9IHYuZHBwIChidG5Hcm91cCk7XG4gICAgdi5kcHAgKGJ1dHRvbk9icyAoWydFbnRlciddLCBJZEVudGVyKSk7XG5cblxuICAgICAgICAvLyBjaHMgRUVYIGRyb3Agc3dhcCBsYXN0XG4gICAgdmFyIElkT3BzMiA9IHYuZHBwIChidG5EaXYpO1xuICAgIGJ0bkdyb3VwLnBhcmVudCA9IElkT3BzMjtcblxuICAgIHZhciBJZENoc0VFWCA9IHYuZHBwIChidG5Hcm91cCk7XG4gICAgdi5kcHAgKGJ1dHRvbk9icyAoWydjaHMnLCAnRUVYJ10sIElkQ2hzRUVYKSk7XG5cbiAgICB2YXIgSWREcm9wU3dhcCA9IHYuZHBwIChidG5Hcm91cCk7XG4gICAgdi5kcHAgKGJ1dHRvbk9icyAoWydkcm9wJywgJ3N3YXAnXSwgSWREcm9wU3dhcCkpO1xuXG4gICAgdmFyIElkTGFzdCA9IHYuZHBwIChidG5Hcm91cCk7XG4gICAgdi5kcHAgKGJ1dHRvbk9icyAoWydsYXN0J10sIElkTGFzdCkpO1xuXG5cblxuXG59OyAvLyBlbmQgZi5yZW5kZXJcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5yZW5kZXJTdHlsZSA9ICgpID0+IHtcbiAgICBcbiAgICB2YXIgc3R5bGVTdHIgPSBgXG4gICAgICAgIC5oZWlnaHQyNCB7XG4gICAgICAgICAgICBoZWlnaHQ6IDk2cHg7XG4gICAgICAgIH1cbiAgICAgICAgLmRhcmtncmV5IHtcbiAgICAgICAgICAgIGNvbG9yOiBkYXJrZ3JleTtcbiAgICAgICAgfVxuICAgICAgICAub3V0bGluZS1udW0ge1xuICAgICAgICAgICAgY29sb3I6IGRhcmtzbGF0ZWJsdWU7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6ICMyOGE3NDU7XG4gICAgICAgIH1cbiAgICAgICAgLndpZHRoMjYge1xuICAgICAgICAgICAgd2lkdGg6IDI2cHg7XG4gICAgICAgIH1cbiAgICAgICAgLndpZHRocyB7XG4gICAgICAgICAgICB3aWR0aDogNTAlO1xuICAgICAgICB9IFxuICAgIGA7XG5cbiAgICB2YXIgc3R5bGUgPSB7c3R5bGU6IHN0eWxlU3RyLCBwYXJlbnQ6ICdoZWFkJ307XG4gICAgdi5kcHAgKHN0eWxlKTtcblxufTsgLy8gZW5kIGYucmVuZGVyU3R5bGVcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi51cGRhdGVTdGFjayA9ICgpID0+IHtcbiAgICBcbiAgICBmb3IgKHZhciBpeCA9IDA7IGl4IDwgNDsgaXgrKykge1xuXG4gICAgICAgIHZhciB2YWwgPSB2LnN0YWNrLmxlbmd0aCA+IGl4ID8gdi5zdGFjayBbaXhdIDogXCJcIjtcbiAgICAgICAgJCh2LklkUmdzdHJzIFtpeF0pXG4gICAgICAgIC50ZXh0ICh2YWwpO1xuXG4gICAgfSAvLyBlbmQgZm9yICh2YXIgaXggPSAwOyBpeCA8IDQ7IGl4KyspXG5cbiAgICBpZiAodi5lZGl0aW5nWCkge1xuXG4gICAgICAgICQodi5JZFJnc3RycyBbMF0pXG4gICAgICAgIC5hZGRDbGFzcyAoJ2RhcmtncmV5Jyk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgICQodi5JZFJnc3RycyBbMF0pXG4gICAgICAgIC5yZW1vdmVDbGFzcyAoJ2RhcmtncmV5Jyk7XG5cbiAgICB9IC8vIGVuZCBpZiAodi5lZGl0aW5nWClcbiAgICBcbiAgICBcblxufTsgLy8gZW5kIGYudXBkYXRlU3RhY2tcblxuXG4gICAgLy8gUFVCTElDIEZ1bmN0aW9uc1xudmFyIFAgPSB7fTtcblxuICAgIC8vIGluaXRcbmYuaW5pdCAoKTtcblxucmV0dXJuIFA7XG5cbn0oKSk7XG5cblxuXG4iXX0=
