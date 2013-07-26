(function(Perseus) {

/* parser generated by jison 0.4.4 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"equation":3,"expression":4,"SIGN":5,"EOF":6,"additive":7,"+":8,"multiplicative":9,"-":10,"triglog":11,"*":12,"negative":13,"/":14,"trig":15,"TRIG":16,"trigfunc":17,"^":18,"TRIGINV":19,"logbase":20,"ln":21,"log":22,"_":23,"subscriptable":24,"power":25,"primitive":26,"variable":27,"VAR":28,"CONST":29,"INT":30,"FLOAT":31,"(":32,")":33,"function":34,"FUNC":35,"invocation":36,"sqrt":37,"abs":38,"|":39,"$accept":0,"$end":1},
terminals_: {2:"error",5:"SIGN",6:"EOF",8:"+",10:"-",12:"*",14:"/",16:"TRIG",18:"^",19:"TRIGINV",21:"ln",22:"log",23:"_",28:"VAR",29:"CONST",30:"INT",31:"FLOAT",32:"(",33:")",35:"FUNC",37:"sqrt",38:"abs",39:"|"},
productions_: [0,[3,4],[3,2],[3,1],[4,1],[7,3],[7,3],[7,1],[9,2],[9,3],[9,3],[9,1],[13,2],[13,1],[15,1],[17,1],[17,3],[17,1],[20,1],[20,1],[20,3],[11,2],[11,2],[11,1],[25,3],[25,1],[27,1],[24,3],[24,1],[24,1],[24,1],[24,1],[24,3],[34,1],[36,4],[36,4],[36,3],[36,4],[26,1],[26,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:return new yy.Eq($$[$0-3], $$[$0-2], $$[$0-1]);
break;
case 2:return $$[$0-1];
break;
case 3:return new yy.Add([]);
break;
case 4:this.$ = $$[$0];
break;
case 5:this.$ = yy.Add.createOrAppend($$[$0-2], $$[$0]);
break;
case 6:this.$ = yy.Add.createOrAppend($$[$0-2], yy.Mul.handleNegative($$[$0], "subtract"));
break;
case 7:this.$ = $$[$0];
break;
case 8:this.$ = yy.Mul.fold(yy.Mul.createOrAppend($$[$0-1], $$[$0]));
break;
case 9:this.$ = yy.Mul.fold(yy.Mul.createOrAppend($$[$0-2], $$[$0]));
break;
case 10:this.$ = yy.Mul.fold(yy.Mul.handleDivide($$[$0-2], $$[$0]));
break;
case 11:this.$ = $$[$0];
break;
case 12:this.$ = yy.Mul.handleNegative($$[$0]);
break;
case 13:this.$ = $$[$0];
break;
case 14:this.$ = [yytext];
break;
case 15:this.$ = $$[$0];
break;
case 16:this.$ = $$[$0-2].concat($$[$0]);
break;
case 17:this.$ = [yytext];
break;
case 18:this.$ = yy.Log.natural();
break;
case 19:this.$ = yy.Log.common();
break;
case 20:this.$ = $$[$0];
break;
case 21:this.$ = yy.Trig.create($$[$0-1], $$[$0]);
break;
case 22:this.$ = yy.Log.create($$[$0-1], $$[$0]);
break;
case 23:this.$ = $$[$0];
break;
case 24:this.$ = new yy.Pow($$[$0-2], $$[$0]);
break;
case 25:this.$ = $$[$0];
break;
case 26:this.$ = yytext;
break;
case 27:this.$ = new yy.Var($$[$0-2], $$[$0]);
break;
case 28:this.$ = new yy.Var($$[$0]);
break;
case 29:this.$ = new yy.Const(yytext.toLowerCase());
break;
case 30:this.$ = new yy.Int(Number(yytext));
break;
case 31:this.$ = new yy.Float(Number(yytext));
break;
case 32:this.$ = $$[$0-1].completeParse().addHint('parens');
break;
case 33:this.$ = yytext;
break;
case 34:this.$ = yy.Pow.sqrt($$[$0-1]);
break;
case 35:this.$ = new yy.Abs($$[$0-1]);
break;
case 36:this.$ = new yy.Abs($$[$0-1]);
break;
case 37:this.$ = new yy.Func($$[$0-3], $$[$0-1]);
break;
case 38:this.$ = $$[$0];
break;
case 39:this.$ = $$[$0];
break;
}
},
table: [{3:1,4:2,6:[1,3],7:4,9:5,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{1:[3]},{5:[1,31],6:[1,32]},{1:[2,3]},{5:[2,4],6:[2,4],8:[1,33],10:[1,34]},{5:[2,7],6:[2,7],8:[2,7],10:[2,7],11:35,12:[1,36],14:[1,37],15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],33:[2,7],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[2,7]},{5:[2,11],6:[2,11],8:[2,11],10:[2,11],12:[2,11],14:[2,11],16:[2,11],19:[2,11],21:[2,11],22:[2,11],28:[2,11],29:[2,11],30:[2,11],31:[2,11],32:[2,11],33:[2,11],35:[2,11],37:[2,11],38:[2,11],39:[2,11]},{10:[1,7],11:8,13:38,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{5:[2,13],6:[2,13],8:[2,13],10:[2,13],12:[2,13],14:[2,13],16:[2,13],19:[2,13],21:[2,13],22:[2,13],28:[2,13],29:[2,13],30:[2,13],31:[2,13],32:[2,13],33:[2,13],35:[2,13],37:[2,13],38:[2,13],39:[2,13]},{10:[1,7],11:8,13:39,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{10:[1,7],11:8,13:40,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{5:[2,23],6:[2,23],8:[2,23],10:[2,23],12:[2,23],14:[2,23],16:[2,23],19:[2,23],21:[2,23],22:[2,23],28:[2,23],29:[2,23],30:[2,23],31:[2,23],32:[2,23],33:[2,23],35:[2,23],37:[2,23],38:[2,23],39:[2,23]},{10:[2,15],16:[2,15],18:[1,41],19:[2,15],21:[2,15],22:[2,15],28:[2,15],29:[2,15],30:[2,15],31:[2,15],32:[2,15],35:[2,15],37:[2,15],38:[2,15],39:[2,15]},{10:[2,17],16:[2,17],19:[2,17],21:[2,17],22:[2,17],28:[2,17],29:[2,17],30:[2,17],31:[2,17],32:[2,17],35:[2,17],37:[2,17],38:[2,17],39:[2,17]},{10:[2,18],16:[2,18],19:[2,18],21:[2,18],22:[2,18],28:[2,18],29:[2,18],30:[2,18],31:[2,18],32:[2,18],35:[2,18],37:[2,18],38:[2,18],39:[2,18]},{10:[2,19],16:[2,19],19:[2,19],21:[2,19],22:[2,19],23:[1,42],28:[2,19],29:[2,19],30:[2,19],31:[2,19],32:[2,19],35:[2,19],37:[2,19],38:[2,19],39:[2,19]},{5:[2,25],6:[2,25],8:[2,25],10:[2,25],12:[2,25],14:[2,25],16:[2,25],18:[1,43],19:[2,25],21:[2,25],22:[2,25],28:[2,25],29:[2,25],30:[2,25],31:[2,25],32:[2,25],33:[2,25],35:[2,25],37:[2,25],38:[2,25],39:[2,25]},{10:[2,14],16:[2,14],18:[2,14],19:[2,14],21:[2,14],22:[2,14],28:[2,14],29:[2,14],30:[2,14],31:[2,14],32:[2,14],35:[2,14],37:[2,14],38:[2,14],39:[2,14]},{5:[2,38],6:[2,38],8:[2,38],10:[2,38],12:[2,38],14:[2,38],16:[2,38],18:[2,38],19:[2,38],21:[2,38],22:[2,38],28:[2,38],29:[2,38],30:[2,38],31:[2,38],32:[2,38],33:[2,38],35:[2,38],37:[2,38],38:[2,38],39:[2,38]},{5:[2,39],6:[2,39],8:[2,39],10:[2,39],12:[2,39],14:[2,39],16:[2,39],18:[2,39],19:[2,39],21:[2,39],22:[2,39],28:[2,39],29:[2,39],30:[2,39],31:[2,39],32:[2,39],33:[2,39],35:[2,39],37:[2,39],38:[2,39],39:[2,39]},{5:[2,28],6:[2,28],8:[2,28],10:[2,28],12:[2,28],14:[2,28],16:[2,28],18:[2,28],19:[2,28],21:[2,28],22:[2,28],23:[1,44],28:[2,28],29:[2,28],30:[2,28],31:[2,28],32:[2,28],33:[2,28],35:[2,28],37:[2,28],38:[2,28],39:[2,28]},{5:[2,29],6:[2,29],8:[2,29],10:[2,29],12:[2,29],14:[2,29],16:[2,29],18:[2,29],19:[2,29],21:[2,29],22:[2,29],28:[2,29],29:[2,29],30:[2,29],31:[2,29],32:[2,29],33:[2,29],35:[2,29],37:[2,29],38:[2,29],39:[2,29]},{5:[2,30],6:[2,30],8:[2,30],10:[2,30],12:[2,30],14:[2,30],16:[2,30],18:[2,30],19:[2,30],21:[2,30],22:[2,30],28:[2,30],29:[2,30],30:[2,30],31:[2,30],32:[2,30],33:[2,30],35:[2,30],37:[2,30],38:[2,30],39:[2,30]},{5:[2,31],6:[2,31],8:[2,31],10:[2,31],12:[2,31],14:[2,31],16:[2,31],18:[2,31],19:[2,31],21:[2,31],22:[2,31],28:[2,31],29:[2,31],30:[2,31],31:[2,31],32:[2,31],33:[2,31],35:[2,31],37:[2,31],38:[2,31],39:[2,31]},{7:45,9:5,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{32:[1,46]},{32:[1,47]},{7:48,9:5,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{32:[1,49]},{5:[2,26],6:[2,26],8:[2,26],10:[2,26],12:[2,26],14:[2,26],16:[2,26],18:[2,26],19:[2,26],21:[2,26],22:[2,26],23:[2,26],28:[2,26],29:[2,26],30:[2,26],31:[2,26],32:[2,26],33:[2,26],35:[2,26],37:[2,26],38:[2,26],39:[2,26]},{32:[2,33]},{4:50,7:4,9:5,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{1:[2,2]},{9:51,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{9:52,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{5:[2,8],6:[2,8],8:[2,8],10:[2,8],12:[2,8],14:[2,8],16:[2,8],19:[2,8],21:[2,8],22:[2,8],28:[2,8],29:[2,8],30:[2,8],31:[2,8],32:[2,8],33:[2,8],35:[2,8],37:[2,8],38:[2,8],39:[2,8]},{10:[1,7],11:8,13:53,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{10:[1,7],11:8,13:54,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{5:[2,12],6:[2,12],8:[2,12],10:[2,12],12:[2,12],14:[2,12],16:[2,12],19:[2,12],21:[2,12],22:[2,12],28:[2,12],29:[2,12],30:[2,12],31:[2,12],32:[2,12],33:[2,12],35:[2,12],37:[2,12],38:[2,12],39:[2,12]},{5:[2,21],6:[2,21],8:[2,21],10:[2,21],12:[2,21],14:[2,21],16:[2,21],19:[2,21],21:[2,21],22:[2,21],28:[2,21],29:[2,21],30:[2,21],31:[2,21],32:[2,21],33:[2,21],35:[2,21],37:[2,21],38:[2,21],39:[2,21]},{5:[2,22],6:[2,22],8:[2,22],10:[2,22],12:[2,22],14:[2,22],16:[2,22],19:[2,22],21:[2,22],22:[2,22],28:[2,22],29:[2,22],30:[2,22],31:[2,22],32:[2,22],33:[2,22],35:[2,22],37:[2,22],38:[2,22],39:[2,22]},{10:[1,7],11:8,13:55,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{24:56,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24]},{10:[1,7],11:8,13:57,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{24:58,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24]},{8:[1,33],10:[1,34],33:[1,59]},{7:60,9:5,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{7:61,9:5,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{8:[1,33],10:[1,34],39:[1,62]},{7:63,9:5,10:[1,7],11:8,13:6,15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[1,27]},{6:[1,64]},{5:[2,5],6:[2,5],8:[2,5],10:[2,5],11:35,12:[1,36],14:[1,37],15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],33:[2,5],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[2,5]},{5:[2,6],6:[2,6],8:[2,6],10:[2,6],11:35,12:[1,36],14:[1,37],15:12,16:[1,17],17:9,19:[1,13],20:10,21:[1,14],22:[1,15],24:18,25:11,26:16,27:20,28:[1,29],29:[1,21],30:[1,22],31:[1,23],32:[1,24],33:[2,6],34:28,35:[1,30],36:19,37:[1,25],38:[1,26],39:[2,6]},{5:[2,9],6:[2,9],8:[2,9],10:[2,9],12:[2,9],14:[2,9],16:[2,9],19:[2,9],21:[2,9],22:[2,9],28:[2,9],29:[2,9],30:[2,9],31:[2,9],32:[2,9],33:[2,9],35:[2,9],37:[2,9],38:[2,9],39:[2,9]},{5:[2,10],6:[2,10],8:[2,10],10:[2,10],12:[2,10],14:[2,10],16:[2,10],19:[2,10],21:[2,10],22:[2,10],28:[2,10],29:[2,10],30:[2,10],31:[2,10],32:[2,10],33:[2,10],35:[2,10],37:[2,10],38:[2,10],39:[2,10]},{10:[2,16],16:[2,16],19:[2,16],21:[2,16],22:[2,16],28:[2,16],29:[2,16],30:[2,16],31:[2,16],32:[2,16],35:[2,16],37:[2,16],38:[2,16],39:[2,16]},{10:[2,20],16:[2,20],19:[2,20],21:[2,20],22:[2,20],28:[2,20],29:[2,20],30:[2,20],31:[2,20],32:[2,20],35:[2,20],37:[2,20],38:[2,20],39:[2,20]},{5:[2,24],6:[2,24],8:[2,24],10:[2,24],12:[2,24],14:[2,24],16:[2,24],19:[2,24],21:[2,24],22:[2,24],28:[2,24],29:[2,24],30:[2,24],31:[2,24],32:[2,24],33:[2,24],35:[2,24],37:[2,24],38:[2,24],39:[2,24]},{5:[2,27],6:[2,27],8:[2,27],10:[2,27],12:[2,27],14:[2,27],16:[2,27],18:[2,27],19:[2,27],21:[2,27],22:[2,27],28:[2,27],29:[2,27],30:[2,27],31:[2,27],32:[2,27],33:[2,27],35:[2,27],37:[2,27],38:[2,27],39:[2,27]},{5:[2,32],6:[2,32],8:[2,32],10:[2,32],12:[2,32],14:[2,32],16:[2,32],18:[2,32],19:[2,32],21:[2,32],22:[2,32],28:[2,32],29:[2,32],30:[2,32],31:[2,32],32:[2,32],33:[2,32],35:[2,32],37:[2,32],38:[2,32],39:[2,32]},{8:[1,33],10:[1,34],33:[1,65]},{8:[1,33],10:[1,34],33:[1,66]},{5:[2,36],6:[2,36],8:[2,36],10:[2,36],12:[2,36],14:[2,36],16:[2,36],18:[2,36],19:[2,36],21:[2,36],22:[2,36],28:[2,36],29:[2,36],30:[2,36],31:[2,36],32:[2,36],33:[2,36],35:[2,36],37:[2,36],38:[2,36],39:[2,36]},{8:[1,33],10:[1,34],33:[1,67]},{1:[2,1]},{5:[2,34],6:[2,34],8:[2,34],10:[2,34],12:[2,34],14:[2,34],16:[2,34],18:[2,34],19:[2,34],21:[2,34],22:[2,34],28:[2,34],29:[2,34],30:[2,34],31:[2,34],32:[2,34],33:[2,34],35:[2,34],37:[2,34],38:[2,34],39:[2,34]},{5:[2,35],6:[2,35],8:[2,35],10:[2,35],12:[2,35],14:[2,35],16:[2,35],18:[2,35],19:[2,35],21:[2,35],22:[2,35],28:[2,35],29:[2,35],30:[2,35],31:[2,35],32:[2,35],33:[2,35],35:[2,35],37:[2,35],38:[2,35],39:[2,35]},{5:[2,37],6:[2,37],8:[2,37],10:[2,37],12:[2,37],14:[2,37],16:[2,37],18:[2,37],19:[2,37],21:[2,37],22:[2,37],28:[2,37],29:[2,37],30:[2,37],31:[2,37],32:[2,37],33:[2,37],35:[2,37],37:[2,37],38:[2,37],39:[2,37]}],
defaultActions: {3:[2,3],30:[2,33],32:[2,2],64:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
undefined/* generated by jison-lex 0.2.0 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            if (this.options.backtrack_lexer) {
                delete backup;
            }
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        if (this.options.backtrack_lexer) {
            delete backup;
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"flex":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return "INT"
break;
case 2:return "FLOAT"
break;
case 3:return "^"
break;
case 4:return "*"
break;
case 5:return "*"
break;
case 6:return "*"
break;
case 7:return "/"
break;
case 8:return "-"
break;
case 9:return "+"
break;
case 10:return "^"
break;
case 11:return "("
break;
case 12:return ")"
break;
case 13:return "_"
break;
case 14:return "|"
break;
case 15:return "!"
break;
case 16:return "SIGN"
break;
case 17:yy_.yytext = "<>"; return "SIGN"
break;
case 18:yy_.yytext = "<>"; return "SIGN"
break;
case 19:yy_.yytext = "<>"; return "SIGN"
break;
case 20:yy_.yytext = "<>"; return "SIGN"
break;
case 21:yy_.yytext = "<="; return "SIGN"
break;
case 22:yy_.yytext = ">="; return "SIGN"
break;
case 23:return "sqrt"
break;
case 24:return "abs"
break;
case 25:return "ln"
break;
case 26:return "log"
break;
case 27:return "TRIG"
break;
case 28:return "TRIG"
break;
case 29:return "TRIGINV"
break;
case 30:return "TRIGINV"
break;
case 31:return "CONST"
break;
case 32:yy_.yytext = "pi"; return "CONST"
break;
case 33:return "VAR"
break;
case 34:yy_.yytext = "theta"; return "VAR"
break;
case 35:return "VAR"
break;
case 36:yy_.yytext = "phi"; return "VAR"
break;
case 37:return yy.symbolLexer(yy_.yytext)
break;
case 38:return "EOF"
break;
case 39:return "INVALID"
break;
case 40:console.log(yy_.yytext);
break;
}
},
rules: [/^(?:\s+)/,/^(?:[0-9]+\.?)/,/^(?:([0-9]+)?\.[0-9]+)/,/^(?:\*\*)/,/^(?:\*)/,/^(?:·)/,/^(?:×)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:_)/,/^(?:\|)/,/^(?:\!)/,/^(?:<=|>=|<>|<|>|=)/,/^(?:=\/=)/,/^(?:\/=)/,/^(?:\!=)/,/^(?:≠)/,/^(?:≤)/,/^(?:≥)/,/^(?:sqrt)/,/^(?:abs)/,/^(?:ln)/,/^(?:log)/,/^(?:sin|cos|tan)/,/^(?:csc|sec|cot)/,/^(?:arcsin|arccos|arctan)/,/^(?:arccsc|arcsec|arccot)/,/^(?:pi)/,/^(?:π)/,/^(?:theta)/,/^(?:θ)/,/^(?:phi)/,/^(?:φ)/,/^(?:[a-zA-Z])/,/^(?:$)/,/^(?:.)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();

Perseus.ExpressionTools = {};
Perseus.ExpressionTools.parser = parser;
})(Perseus);