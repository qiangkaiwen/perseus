/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, no-undef, no-var, react/jsx-closing-bracket-location, react/jsx-indent-props, react/jsx-sort-prop-types, react/prop-types, react/sort-comp, space-infix-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */


var React = require("react");
var ReactDOM = require("react-dom");
var _ = require("underscore");

var Changeable   = require("../mixins/changeable.jsx");

var Renderer = require("../renderer.jsx");
var PassageMarkdown = require("./passage/passage-markdown.jsx");

var Passage = React.createClass({
    mixins: [Changeable],

    propTypes: {
        passageTitle: React.PropTypes.string,
        passageText: React.PropTypes.string,
        footnotes: React.PropTypes.string,
        showLineNumbers: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            passageTitle: "",
            passageText: "",
            footnotes: "",
            showLineNumbers: true
        };
    },

    getInitialState: function() {
        return {
            nLines: null,
            startLineNumbersAfter: 0,
        };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) ||
            !_.isEqual(this.state, nextState);
    },

    render: function() {
        var lineNumbers;
        var nLines = this.state.nLines;
        if (this.props.showLineNumbers && nLines) {
            // lineN is the line number in the current passage;
            // the displayed line number is
            // lineN + this.state.startLineNumbersAfter, where
            // startLineNumbersAfter is the sum of all line numbers
            // in earlier passages.
            lineNumbers = _.range(1, nLines + 1).map((lineN) => {
                if (lineN === 4 && nLines > 4) {
                    return <span
                            key="line-marker"
                            className="line-marker">
                        Line
                    </span>;
                } else {
                    return lineN + this.state.startLineNumbersAfter;
                }
            });
        }

        var rawContent = this.props.passageText;
        var parseState = {};
        var parsedContent = PassageMarkdown.parse(rawContent, parseState);

        return <div className="perseus-widget-passage-container">
            {this._renderInstructions(parseState)}
            <div className="perseus-widget-passage">
                <div className="passage-title">
                    <Renderer content={this.props.passageTitle} />
                </div>
                {lineNumbers &&
                    <div className="line-numbers" aria-hidden={true}>
                        {lineNumbers}
                    </div>
                }
                <h3 className="perseus-sr-only">
                    {i18n._("Beginning of reading passage.")}
                </h3>
                <div className="passage-text">
                    {this._renderContent(parsedContent)}
                </div>
                {this._hasFootnotes() && [
                    <h4 key="footnote-start" className="perseus-sr-only">
                        {i18n._("Beginning of reading passage footnotes.")}
                    </h4>,
                    <div key="footnotes" className="footnotes">
                        {this._renderFootnotes()}
                    </div>
                ]}
                <div className="perseus-sr-only">
                    {i18n._("End of reading passage.")}
                </div>
            </div>
        </div>;
    },

    componentDidMount: function() {
        this._updateState();
    },

    componentDidUpdate: function() {
        this._updateState();
    },

    _updateState: function() {
        this.setState({
            nLines: this._measureLines(),
            startLineNumbersAfter: this._getInitialLineNumber(),
        });
    },

    _measureLines: function() {
        var $renderer = $(ReactDOM.findDOMNode(this.refs.content));
        var contentsHeight = $renderer.height();
        var lineHeight = parseInt($renderer.css("line-height"));
        var nLines = Math.round(contentsHeight / lineHeight);
        return nLines;
    },

    _getInitialLineNumber: function() {
        var isPassageBeforeThisPassage = true;
        var passagesBeforeUs = this.props.interWidgets((id, widgetInfo) => {
            if (widgetInfo.type !== "passage") {
                return false;
            }
            if (id === this.props.widgetId) {
                isPassageBeforeThisPassage = false;
            }
            return isPassageBeforeThisPassage;
        });

        return passagesBeforeUs.map((passageWidget) => {
            return passageWidget.getLineCount();
        }).reduce((a, b) => a + b, 0);
    },

    getLineCount: function() {
        if (this.state.nLines != null) {
            return this.state.nLines;
        } else {
            return this._measureLines();
        }
    },

    _renderInstructions: function(parseState) {
        var firstQuestionNumber = parseState.firstQuestionRef;
        var firstSentenceRef = parseState.firstSentenceRef;

        var instructions = "";
        if (firstQuestionNumber) {
            instructions += i18n._(
                "The symbol %(questionSymbol)s indicates that question " +
                "%(questionNumber)s references this portion of the passage.",
                {
                    questionSymbol: "[[" + firstQuestionNumber + "]]",
                    questionNumber: firstQuestionNumber,
                }
            );
        }
        if (firstSentenceRef) {
            instructions += i18n._(
                " The symbol %(sentenceSymbol)s indicates that the " +
                "following sentence is referenced in a question.",
                {
                    sentenceSymbol: "[" + firstSentenceRef + "]",
                }
            );
        }
        var parsedInstructions = PassageMarkdown.parse(instructions);
        return <div className="perseus-widget-passage-instructions">
            {PassageMarkdown.output(parsedInstructions)}
        </div>;
    },

    _renderContent: function(parsed) {
        return <div ref="content">
            {PassageMarkdown.output(parsed)}
        </div>;
    },

    _hasFootnotes: function() {
        var rawContent = this.props.footnotes;
        var isEmpty = /^\s*$/.test(rawContent);
        return !isEmpty;
    },

    _renderFootnotes: function() {
        var rawContent = this.props.footnotes;
        var parsed = PassageMarkdown.parse(rawContent);
        return PassageMarkdown.output(parsed);
    },

    _getStartRefLineNumber: function(referenceNumber) {
        var refRef = PassageMarkdown.START_REF_PREFIX + referenceNumber;
        var ref = this.refs[refRef];
        if (!ref) {
            return null;
        }

        var $ref = $(ReactDOM.findDOMNode(ref));
        // We really care about the first text after the ref, not the
        // ref element itself:
        var $refText = $ref.next();
        if ($refText.length === 0) {
            // But if there are no elements after the ref, just
            // use the ref itself.
            $refText = $ref;
        }
        var vPos = $refText.offset().top;

        return this.state.startLineNumbersAfter + 1 +
            this._convertPosToLineNumber(vPos);
    },

    _getEndRefLineNumber: function(referenceNumber) {
        var refRef = PassageMarkdown.END_REF_PREFIX + referenceNumber;
        var ref = this.refs[refRef];
        if (!ref) {
            return null;
        }

        var $ref = $(ReactDOM.findDOMNode(ref));
        // We really care about the last text before the ref, not the
        // ref element itself:
        var $refText = $ref.prev();
        if ($refText.length === 0) {
            // But if there are no elements before the ref, just
            // use the ref itself.
            $refText = $ref;
        }
        var height = $refText.height();
        var vPos = $refText.offset().top;

        var line = this._convertPosToLineNumber(vPos + height);
        if (height === 0) {
            // If the element before the end ref span was the start
            // ref span, it might have 0 height. This is obviously not
            // the intended use case, but we should handle it gracefully.
            // If this is the case, then the "bottom" of our element is
            // actually the top of the line we're on, so we need to add
            // one to the line number.
            line += 1;
        }

        return this.state.startLineNumbersAfter + line;
    },

    _convertPosToLineNumber: function(absoluteVPos) {
        var $content= $(ReactDOM.findDOMNode(this.refs.content));
        var relativeVPos = absoluteVPos - $content.offset().top;
        var lineHeight = parseInt($content.css("line-height"));

        var line = Math.round(relativeVPos / lineHeight);
        return line;
    },

    _getRefContent: function(referenceNumber) {
        var refRef = PassageMarkdown.START_REF_PREFIX + referenceNumber;
        var ref = this.refs[refRef];
        if (!ref) {
            return null;
        }
        return ref.getRefContent();
    },

    getReference: function(referenceNumber) {
        var refStartLine = this._getStartRefLineNumber(referenceNumber);
        var refEndLine = this._getEndRefLineNumber(referenceNumber);
        if (refStartLine == null || refEndLine == null) {
            return null;
        }
        var refContent = this._getRefContent(referenceNumber);

        return {
            startLine: refStartLine,
            endLine: refEndLine,
            content: refContent,
        };
    },

    getUserInput: function() {
        return null;
    },

    simpleValidate: function(rubric) {
        return Passage.validate(this.getUserInput(), rubric);
    }
});

_.extend(Passage, {
    validate: function(state, rubric) {
        return {
            type: "points",
            earned: 0,
            total: 0,
            message: null
        };
    }
});

module.exports = {
    name: "passage",
    displayName: "Passage",
    widget: Passage,
    transform: (editorProps) => {
        return _.pick(editorProps, "passageTitle", "passageText", "footnotes",
            "showLineNumbers");
    }
};
