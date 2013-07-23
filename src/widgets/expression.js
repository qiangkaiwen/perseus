/** @jsx React.DOM */
(function(Perseus) {

var parse = Perseus.ExpressionTools.parse;
var compare = Perseus.ExpressionTools.compare;

var Expression = React.createClass({
    getDefaultProps: function() {
        return {
            currentValue: "",
            times: false
        };
    },

    getInitialState: function() {
        return {
            lastParsedTex: ""
        };
    },

    componentWillMount: function() {
        this.updateParsedTex(this.props.currentValue);
    },

    componentWillReceiveProps: function(nextProps) {
        this.updateParsedTex(nextProps.currentValue);
    },

    render: function() {
        var MJ = Perseus.MJ;  // MathJax
        var result = parse(this.props.currentValue);

        return <span className="perseus-widget-expression">
            <input ref="input" type="text"
                value={this.props.currentValue}
                onKeyDown={this.handleKeyDown}
                onKeyPress={this.handleKeyPress}
                onChange={this.handleChange} />
            <span className="output">
                <span className="mathjax"
                        style={{opacity: result.parsed ? 1.0 : 0.5}}>
                    <MJ>{this.state.lastParsedTex}</MJ>
                </span>
                <span className="placeholder">
                    <span ref="error" className="error"
                            style={{display: "none"}}>
                        <span className="buddy" />
                        <span className="message"><span>
                            {"Sorry, I don't understand that!"}
                        </span></span>
                    </span>
                </span>
            </span>
        </span>;
    },

    errorTimeout: null,

    componentDidMount: function() {
        this.componentDidUpdate();
    },

    componentDidUpdate: function() {
        clearTimeout(this.errorTimeout);
        if (parse(this.props.currentValue).parsed) {
            this.hideError();
        } else {
            this.errorTimeout = setTimeout(this.showError, 2000);
        }
    },

    componentWillUnmount: function() {
        clearTimeout(this.errorTimeout);
    },

    showError: function() {
        var $error = $(this.refs.error.getDOMNode());
        if (!$error.is(":visible")) {
            $error.css({ top: 50, opacity: 0.1 }).show()
                .animate({ top: 0, opacity: 1.0 }, 300);
        }
    },

    hideError: function() {
        var $error = $(this.refs.error.getDOMNode());
        if ($error.is(":visible")) {
            $error.animate({ top: 50, opacity: 0.1 }, 300, function() {
                $(this).hide();
            });
        }
    },

    /**
     * The keydown handler handles clearing the error timeout, telling
     * props.currentValue to update, and intercepting the backspace key when
     * appropriate...
     */
    handleKeyDown: function(event) {
        var input = this.refs.input.getDOMNode();
        var text = input.value;

        var start = input.selectionStart;
        var end = input.selectionEnd;
        var supported = start !== undefined;

        var which = event.nativeEvent.keyCode;

        if (supported && which === 8 /* backspace */) {
            if (start === end && text.slice(start - 1, start + 1) === "()") {
                event.preventDefault();
                var val = text.slice(0, start - 1) + text.slice(start + 1);

                // this.props.onChange will update the value for us, but
                // asynchronously, making it harder to set the selection
                // usefully, so we just set .value directly here as well.
                input.value = val;
                input.selectionStart = start - 1;
                input.selectionEnd = end - 1;
                this.props.onChange({currentValue: val});
            }
        }
    },

    /**
     * ...whereas the keypress handler handles the parentheses because keyCode
     * is more useful for actual character insertions (keypress gives 40 for an
     * open paren '(' instead of keydown which gives 57, the code for '9').
     */
    handleKeyPress: function(event) {
        var input = this.refs.input.getDOMNode();
        var text = input.value;

        var start = input.selectionStart;
        var end = input.selectionEnd;
        var supported = start !== undefined;

        var which = event.nativeEvent.keyCode;

        if (supported && which === 40 /* left paren */) {
            event.preventDefault();

            var val;
            if (start === end) {
                var insertMatched = _.any([" ", ")", ""], function(val) {
                    return text.charAt(start) === val;
                });

                val = text.slice(0, start) +
                        (insertMatched ? "()" : "(") + text.slice(end);
            } else {
                val = text.slice(0, start) +
                        "(" + text.slice(start, end) + ")" + text.slice(end);
            }

            input.value = val;
            input.selectionStart = start + 1;
            input.selectionEnd = end + 1;
            this.props.onChange({currentValue: val});

        } else if (supported && which === 41 /* right paren */) {
            if (start === end && text.charAt(start) === ")") {
                event.preventDefault();
                input.selectionStart = start + 1;
                input.selectionEnd = end + 1;
            }
        }
    },

    handleChange: function(event) {
        this.props.onChange({currentValue: event.target.value});
    },

    focus: function() {
        this.refs.input.getDOMNode().focus();
        return true;
    },

    toJSON: function(skipValidation) {
        return {currentValue: this.props.currentValue};
    },

    updateParsedTex: function(value) {
        var result = parse(value);
        var options = _.pick(this.props, "times");
        if (result.parsed) {
            this.setState({lastParsedTex: result.expr.asTex(options)});
        }
    },

    simpleValidate: function(rubric) {
        return Expression.validate(this.toJSON(), rubric);
    },

    examples: function() {
        var mult = $._("For $2\\cdot2$, enter **2*2**");
        if (this.props.times) {
            mult = mult.replace(/\\cdot/g, "\\times");
        }

        return [
            mult,
            $._("For $3y$, enter **3y** or **3*y**"),
            $._("For $\\dfrac{1}{x}$, enter **1/x**"),
            $._("For $x^{y}$, enter **x^y**"),
            $._("For $\\pi$, enter **pi**"),
            $._("For $\\le$ or $\\ge$, enter **<=** or **>=**"),
            $._("For $\\neq$, enter **=/=**")
        ];
    }
});

_.extend(Expression, {
    validate: function(state, rubric) {
        var answer = parse(state.currentValue);
        var expected = parse(rubric.value);

        if (!state.currentValue || !answer.parsed) {
            return {
                type: "invalid",
                message: null
            };
        }

        var result = compare(answer.expr, expected.expr, rubric);

        return {
            type: "points",
            earned: result.equal ? 1 : 0,
            total: 1,
            message: result.message
        };
    }
});

var ExpressionEditor = React.createClass({
    getDefaultProps: function() {
        return {
            form: false,
            simplify: false,
            times: false
        };
    },

    optionLabels: {
        form: "Answer expression must have the same form.",
        simplify: "Answer expression must be fully expanded and simplified.",
        times: "Use \u00D7 for rendering multiplication instead of a center dot."
    },

    render: function() {
        return <div>
            <label>
                Correct answer:
                <Expression ref="expression"
                    currentValue={this.props.value}
                    times={this.props.times}
                    onChange={function(newProps) {
                        if ("currentValue" in newProps) {
                            newProps.value = newProps.currentValue;
                            delete newProps.currentValue;
                        }
                        this.props.onChange(newProps);
                    }.bind(this)} />
            </label>

            {_.map(this.optionLabels, function(labelText, option) {
                return <label key={option}>
                    <input type="checkbox" name={option}
                        checked={this.props[option]}
                        onChange={this.handleCheck} />
                    {labelText}
                </label>;
            }, this)}
        </div>;
    },

    handleCheck: function(e) {
        var newProps = {};
        newProps[e.target.name] = e.target.checked;
        this.props.onChange(newProps);
    },

    focus: function() {
        this.refs.expression.focus();
        return true;
    },

    toJSON: function(skipValidation) {
        var value = this.props.value;

        if (!skipValidation) {
            if (value === "") {
                alert("Warning: No expression has been entered.");
            } else if (!parse(value).parsed) {
                alert("Warning: Entered expression didn't parse.");
            }
        }

        return _.pick(this.props, "value", "form", "simplify", "times");
    }
});

Perseus.Widgets.register("expression", Expression);
Perseus.Widgets.register("expression-editor", ExpressionEditor);

})(Perseus);
