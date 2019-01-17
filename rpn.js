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



