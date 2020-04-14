// rpn.js

module.exports = (function () {

var v = {

    j2h: require ('go-j2h'),
    dpp: null,
    genIds: null,

    IdRoot: null,
    IdStack: null,
    IdButtons: {},
    IdBuffer: null,

    ky0: require ('go-key'),
    IdRgstrs: [],
    stack: [],

    keyMap: {
        'b': 'bs',
        'c': 'chs',
        'd': 'drop',
        'e': 'eex',
        'h': 'history',
        'l': 'last',
        'p': 'prec',  // decimal precision to display stack values
        's': 'swap',
        '^c': 'copy',
        '^v': 'paste',
    },

    history: [],
    last: [],

    precision: 2,
};

var A = {};
var cb = {};
var f = {};


//---------------------
A.init = () => {

    v.dpp = v.j2h.displayObA;
    v.genIds = v.j2h.genIds;

    v.IdRoot = v.dpp ({
        div:0, 
        class: 'container mt-3'
    });

    v.IdBuffer = v.dpp ({
        textarea: 0,
//        class: 'hidden',
    });


    f.render ();

    v.ky = new v.ky0 ('body', false, cb.keyDown, null, null, true);
    f.clicks ();
    
}; // end A.init

//---------------------
cb.keyDown = (keyOb) => {
    
    var key = keyOb.ch.toLowerCase ();

    if (keyOb.ctrl) {

        key = '^' + key;

    } // end if (keyOb.ctrl)

    key = v.keyMap.hasOwnProperty (key) ? v.keyMap [key] : key;

    f.action (key);

}; // end cb.keyDown 


//---------------------
f.action = (key) => {
    
        // ----  actionBinary ----
    var actionBinary = function (op) {

            // ----  actionBinary.doBinaryOp ----
        var doBinaryOp = function () {
    
            var res;
    
            switch (op) {
    
                case '+':
                case '=':  // for convience, so not necessary to press shift when entering a '+'
    
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
    
                v.stack.push (xVal);
                v.stack.push (yVal);
    
            } else {
    
                v.stack.push (res);
    
                v.last = [];
                v.last.push (yVal);
                v.last.push (xVal);
    
    
            } // end if (op === 'swap')
            
        };  // end actionBinary.doBinaryOp
    
    
           // ---- actionBinary.main ----
        if (v.stack.length >= 2) {
    
            var xOb = makeValidX ();
            var xVal = xOb.xVal;
            v.stack.pop ();

            var yVal = v.stack.pop ();

            doBinaryOp ();
            
        } // end if (v.stack.length >= 2)
        
    };  // end actionBinary


        // ----  actionBS ----
    var actionBS = function () {

        var xVal = f.top ();

        if (xVal === null) {

            // do nothing or flash err

        } else if (f.xIsStr ()) {

            var strLen = xVal.length;
            if (strLen === 1) {

                v.stack.pop ();

            } else {

                xVal = xVal.substring (0, strLen - 1);

                v.stack.pop ();
                v.stack.push (xVal);

            } // end if (strLen === 1)
            
        } else {

            actionDrop ();

        } // end if (xVal === null)
        

    };  // end actionBS


        // ----  actionChs ----
    var actionChs = function () {

        var res;
        var xVal = f.top ();

        if (xVal === null) {

            // do nothing or flash err


        } else {

            if (f.xIsStr ()) {

                if (xVal.match (/E/)) {
    
                    res = xVal.match (/E-/) ? xVal.replace (/E-/, 'E') : xVal.replace (/E/, 'E-');
    
                } else {
    
                    res = xVal.match (/^-/) ? xVal.substring (1) : '-' + xVal;
    
                } // end if (xVal.match (/E/))

            } else {

                res = -xVal;

            } // end if (f.xIsStr ())
            
            v.stack.pop ();
            v.stack.push (res);

        } // end if (xVal === null)


    };  // end actionChs


        // ----  actionCopy ----
    var actionCopy = function () {
    }

        // ----  actionDot ----
    var actionDot = function () {

        var xVal = f.top ();

        if (xVal === null || !f.xIsStr ()) {

            actionNum ('0.');

        } else if (!xVal.match (/\./)) {

            actionNum ('.');

        } // end if (xVal === null || !f.xIsStr ())
        
    };  // end actionDot



        // ----  actionDrop ----
    var actionDrop = function () {

        if (v.stack.length > 0) {

            v.last = [v.stack.pop ()];

        } // end if (v.stack.length > 0)
        
    };  // end actionDrop


        // ----  actionEEX ----
    var actionEEX = function () {

        var xVal = f.top ();

        if (xVal === null || !f.xIsStr ()) {

            actionNum ('1E');

        } else if (!xVal.match (/E/)) {

            var eKey = xVal.match (/\.$/) ? '0E' : 'E';
            actionNum (eKey);

        } // end if (xVal === null || !f.xIsStr ())
        
    };  // end actionEEX


        // ----  actionEnter ----
    var actionEnter = function () {

        var xOb = makeValidX ();

        var xVal = xOb.xVal;

        if (xVal !== null && !xOb.wasStr) {

            v.stack.push (xVal);

        } // end if (xOb.xVal !== null && !xOb.wasStr)
        
        v.last = [];

    };  // end actionEnter


        // ----  actionHistory ----
    var actionHistory = function () {

        var histStr = "";

        v.history.forEach (function (key) {

            histStr += key + "\n";
        });

        alert (histStr);

    };  // end actionHistory


        // ----  actionNum ----
    var actionNum = function (key) {

        if (f.xIsStr ()) {
            
            v.stack [v.stack.length - 1] += key;

        } else {
        
            v.stack.push (key);
        
        } // end if (v.editingX)
    
    };  // end actionNum 


        // ----  actionPaste ----
    var actionPaste = function () {

        $(v.IdBuffer)
        .val ('')
        .select ();

        var res = document.execCommand ('paste');
 //$(v.IdBuffer)
 //.val ('34.5 18.2');

        var pasted = $(v.IdBuffer).val ();
//        pasted = pasted.replace (/\n/g, ' ');
            console.log ('pasted: ' + JSON.stringify (pasted) + '\n');
        //$(v.IdBuffer).val ("");
    }

        // ----  actionPrecision ----
    var actionPrecision = function () {

        if (v.stack.length >= 1) {
    
            var xOb = makeValidX ();
            v.precision = xOb.xVal;
            v.stack.pop ();

        } // end if (v.stack.length >= 1)

    };  // end actionPrecision


        // ----  actionRestore ----
    var actionRestore = function () {

        if (v.last.length > 1) {
            // if binary op, remove the x value before pushing y and x

            v.stack.pop ();

        } // end if (v.last.length > 1)
        
        while (v.last.length > 0) {

            v.stack.push (v.last.shift ());

        } // end while (v.last.length > 0)
        
    };  // end actionRestore


        // ----  makeValidX ----
    var makeValidX = function () {

        var resX;
        var res = {wasStr: false};

        var xVal = f.top ();

        if (xVal === null) {

            resX = null;

        } else if (typeof xVal === 'string') {

            if (xVal.match (/[\-.E]$/)) {

                xVal += '0';

            } // end if (xVal.match (/[.E]$/))

            var xValN = JSON.parse (xVal);

            v.stack.pop ();
            v.stack.push (xValN);

            resX = xValN;

            res.wasStr = true;

        } else {

            resX = xVal;

        } // end if (xVal === null)
        
        res.xVal = resX;

        return res;

    };  // end makeValidX


       // ---- main ----

    v.history.push (key);

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

            actionNum (key);
            break;

        case '.':

            actionDot ();
            break;

        case 'eex':

            actionEEX ();
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

        case 'history':

            actionHistory ();
            break;

        case 'copy':

            actionCopy ();
            break;

        case 'paste':

            actionPaste ();
            break;

        case 'prec':
            // precision. x = number of digits to right of decimal

            actionPrecision ();
            break;

    } // end switch (key)
    
    f.updateStack ();

}; // end f.action 



//---------------------
f.clicks = () => {
    
    for (var key in v.IdButtons) {

        var Id = v.IdButtons [key];

        $(Id)
        .click ((event) => {
            var key = $('#' + event.target.id).text ();
            key = key.toLowerCase ();
            key = key === 'b' ? 'bs' : key;

            f.action (key);
        });
    }

}; // end f.clicks


//---------------------
f.render = () => {
    
        // ----  buttonObs  ----
    var buttonObs = function (vals, parent) {

        res = [];
        for (var ix = 0; ix < vals.length; ix++) {

            var val = vals [ix];
            val = typeof val === 'string' ? val : JSON.stringify (val);

            //var Ids = v.genIds ();
            //var id = Ids [0];
            //v.IdButtons [val] = Ids [1];
            var id;
            [id, v.IdButtons [val]] = v.genIds ();
    
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

    var logo = {img: 0, class: 'd-block-inline mb-1', src: 'Images/RPNCalc.png'};

    var help = {button: {span: '?', class: "quest-mark"}, class: 'btn float-right circular-button'};
    var helpIds = v.genIds ();
    help.id = helpIds [0];
    var IdHelp = helpIds [1];

    var hdr = {div: [logo, help], class: 'widths', parent: v.IdRoot};

    var sxsw = {img: 0, class: 'd-block widths mb-3', src: 'Images/sxsw2010.png', parent: v.IdRoot};
    var stack = {div: 0, class: 'border border-primary rounded w-50 mb-2 height24', parent: v.IdRoot};
//    var numbers = {div: 0, class: ''}

        // stack
    v.IdStack = v.dpp ([hdr, sxsw, stack])[2];

//    var helpOb = {title: f.renderHelp (), html: true, delay: {hide: 3000}};
    var helpOb = {title: f.renderHelp (), html: true, trigger: 'click'};

    $(IdHelp)
    .tooltip (helpOb);

    var toolTimeoutId = null;

    $(IdHelp)
    .hover (
        function () {
            $('.tooltip')
            .css ({display: 'initial'});

            $(this)
            .tooltip ('show');
        },
        function () {
            $('.tooltip')
            .fadeOut (400);

            toolTimeoutId = setTimeout (function () {
                    $(this)
                    .tooltip ('hide');
            }, 400);

        }
    );

    $('.tooltip')
    .click (function () {
        //  alert ('me');
    })

    .hover (
        function () {
            if (toolTimeoutId !== null) {

                clearTimeout (toolTimeoutId);
                toolTimeoutId = null;

            } // end if (toolTimeoutId !== null)

            $('.tooltip')
            .stop ();
            //.css ({display: 'initial'});

            $(IdHelp)
            .tooltip ('show');
            
        },
        function () {
            $(IdHelp)
            .tooltip ('hide');
        }
    );

// $(IdHelp)
// .tooltip ('hide');

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
    var btnDiv = {div: 0, class: 'd-inline-block align-top mr-3', parent: v.IdRoot};

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

    var IdLastPrec = v.dpp (btnGroup);
    v.dpp (buttonObs (['last', 'prec'], IdLastPrec));

}; // end f.render


//---------------------
f.renderHelp = () => {
    
    var res = `
        <div>
            <h4 class='font-weight-bold m-0'>Reverse Polish Notation (RPN)<br>Calculator</h4>
            <hr class='m-0'>
            <p class='m-0'>
                Try:<br>
                5, Enter, 7, +<br>
                verify result is 12<br>
                <a href="http://en.wikipedia.org/wiki/Reverse_Polish_notation">Wikipedia on RPN</a>
            </p>
            <hr class='m-0'>
            <h5 class='font-weight-bold m-0'>Keyboard Shortcuts</h5>
            <p class='m-0'>
                First key of each operation (case insensitve):<br>
                'c' for chs, 'e' for 'EEX', etc. 
            </p>
            <hr class='m-0'>
            <h5 class='font-weight-bold m-0'>Scientific Notation</h5>
            <p class='m-0'>
                Scientific notation is supported: <br>
                5.3E2 = 5.3*10^2 = 530<br>
                3.23e-2 = .0323 <br>
            </p>
            <hr class='m-0'>
            <h5 class='font-weight-bold m-0'>Change Sign</h5>
            <p class='m-0'>
                use chs to change the sign<br>
                (the minus sign '-' is only for subtraction<br>
                not changing the sign)
            </p>
        </div>
    `;

    return res;

}; // end f.renderHelp


//---------------------
f.renderStyle = () => {
    
    var styleStr = `
        .circular-button {
            width: 24px;
            height:24px;
            border: 2px solid black;
            border-radius:12px;
            border-color: green;
            background-color: #DBF7DB;
        }
        .quest-mark {
            font-size: 20px;
            font-weight: bold;
            position: relative;
            top: -11px;
            left: -6px;
        }
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
        .tooltip.left .tooltip-arrow {
            border-left-color: #B0BABE;
        }
        .tooltip.bottom .tooltip-arrow {
            border-bottom-color: #B0BABE;
        }
        .tooltip.right .tooltip-arrow {
            border-right-color: #B0BABE;
        }
        .tooltip.top .tooltip-arrow {
            border-top-color: #B0BABE;
        }
        .tooltip-inner {
            padding: 0;
            background-color: #e3edf1;
            color: black;
            font-weight: 600;
            max-width: 600px;
        } 
        .tooltip.show {
            opacity: 1.0;
        }
        .hidden {
            visibility: hidden;
        }
    `;

    var style = {style: styleStr, parent: 'head'};
    v.dpp (style);

}; // end f.renderStyle


//---------------------
f.top = () => {
    
    var stLen = v.stack.length;

    var res = stLen > 0 ? v.stack [stLen - 1] : null;

    return res;

}; // end f.top


//---------------------
f.updateStack = () => {
    
        // ----  rnd ----
    var rnd = function (val) {

        var mult = 1;
        for (var ix = 0; ix < v.precision; ix++) {

            mult *= 10;

        } // end for (var ix = 0; ix < v.precision; ix++)
        
        var res = Math.round (val * mult)/mult;
        return res;

    };  // end rnd 


       // ---- main ----
    var stLen = v.stack.length;

    for (var ix = 0; ix < 4; ix++) {

        var idx = stLen - ix - 1;

        var val = v.stack [idx];
        if (typeof val !== 'string') {

            val = idx >= 0 ? rnd (v.stack [idx]) : "";

        } // end if (typeof val !== 'string')
        
        $(v.IdRgstrs [ix])
        .text (val);

    } // end for (var ix = 0; ix < 4; ix++)

    if (f.xIsStr ()) {

        $(v.IdRgstrs [0])
        .addClass ('darkgrey');

    } else {

        $(v.IdRgstrs [0])
        .removeClass ('darkgrey');

    } // end if (f.xIsStr ())
    
    

}; // end f.updateStack


//---------------------
f.xIsStr = () => {
    
    var topVal = f.top ();
    var res = false;

    if (topVal !== null && typeof topVal === 'string') {

        res = true;

    } // end if (topVal !== null && typeof topVal === 'string';)
    
    return res;

}; // end f.xIsStr



    // PUBLIC Functions
var P = {};

    // init
A.init ();

return P;

}());



