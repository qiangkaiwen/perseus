/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable no-unused-vars, no-var, react/jsx-closing-bracket-location, react/sort-comp */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

const React = require('react');
const { StyleSheet, css } = require("aphrodite");
const classnames = require('classnames');
const i18n = window.i18n;

const Renderer = require("./renderer.jsx");

const EnabledFeatures = require("./enabled-features.jsx");
const ApiOptions = require("./perseus-api.jsx").Options;

/* Renders just a hint preview */
const HintRenderer = React.createClass({
    propTypes: {
        apiOptions: ApiOptions.propTypes,
        className: React.PropTypes.string,
        enabledFeatures: EnabledFeatures.propTypes,
        hint: React.PropTypes.any,
        lastHint: React.PropTypes.bool,
        lastRendered: React.PropTypes.bool,
        pos: React.PropTypes.number,
        totalHints: React.PropTypes.number,
    },

    getSerializedState: function() {
        return this.refs.renderer.getSerializedState();
    },

    restoreSerializedState: function(state, callback) {
        this.refs.renderer.restoreSerializedState(state, callback);
    },

    render: function() {
        const {
            apiOptions,
            enabledFeatures,
            className,
            hint,
            lastHint,
            lastRendered,
            pos,
            totalHints,
        } = this.props;
        const newHintStyles = enabledFeatures.newHintStyles;
        const classNames = classnames(
            'perseus-hint-renderer',
            newHintStyles && 'perseus-hint-renderer-new',
            lastHint && 'last-hint',
            lastRendered && 'last-rendered',
            className
        );

        // TODO(charlie): Allowing `staticRender` here would require that we
        // extend `HintsRenderer` and `HintRenderer` to implement the full
        // "input' API, so that clients could access the static inputs. Allowing
        // `customKeypad` would require that we extend `ItemRenderer` to support
        // nested inputs in the `HintsRenderer`. For now, we disable these
        // options. Instead, clients will get standard <input/> elements, which
        // aren't nice to use on mobile, but are at least usable.
        const rendererApiOptions = {
            ...apiOptions,
            customKeypad: false,
            staticRender: false,
        };

        return <div className={classNames} tabIndex="-1">
            {!newHintStyles && <span className="perseus-sr-only">
                {i18n._("Hint #%(pos)s", {pos: pos + 1})}
            </span>}
            {!newHintStyles && totalHints && pos != null && <span
                className="perseus-hint-label"
            >
                {`${pos + 1} / ${totalHints}`}
            </span>}
            {newHintStyles && <div className="perseus-hint-label-new">
                {i18n._("Hint %(pos)s", {pos: pos + 1})}
            </div>}
            <Renderer
                ref="renderer"
                widgets={hint.widgets}
                content={hint.content || ""}
                images={hint.images}
                enabledFeatures={enabledFeatures}
                apiOptions={rendererApiOptions}
            />
        </div>;
    },
});

module.exports = HintRenderer;
