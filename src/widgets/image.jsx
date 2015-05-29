var _ = require("underscore");
var Util = require("../util.js");

var BlurInput    = require("react-components/blur-input.jsx");
var Editor       = require("../editor.jsx");
var InfoTip      = require("react-components/info-tip.jsx");
var Renderer     = require("../renderer.jsx");

var Changeable   = require("../mixins/changeable.jsx");
var EditorJsonify = require("../mixins/editor-jsonify.jsx");

var Graphie      = require("../components/graphie.jsx");
var RangeInput   = require("../components/range-input.jsx");
var SvgImage     = require("../components/svg-image.jsx");
var TextInput    = require("../components/text-input.jsx");

var defaultBoxSize = 400;
var defaultRange = [0, 10];
var defaultBackgroundImage = {
    url: null,
    width: 0,
    height: 0
};

/**
 * Alignment option for captions, relative to specified coordinates.
 */
var alignments = [
    "center",
    "above",
    "above right",
    "right",
    "below right",
    "below",
    "below left",
    "left",
    "above left"
];

function blankLabel() {
    return {
        content: "",
        coordinates: [0, 0],
        alignment: "center"
    };
}

var ImageWidget = React.createClass({
    mixins: [Changeable],

    propTypes: {
        title: React.PropTypes.string,
        range: React.PropTypes.arrayOf(
            React.PropTypes.arrayOf(React.PropTypes.number
            )
        ),
        box: React.PropTypes.arrayOf(React.PropTypes.number),
        backgroundImage: React.PropTypes.shape({
            url: React.PropTypes.string,
            width: React.PropTypes.number,
            height: React.PropTypes.number
        }),
        labels: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                content: React.PropTypes.string,
                coordinates: React.PropTypes.arrayOf(React.PropTypes.number),
                alignment: React.PropTypes.string
            })
        ),
        alt: React.PropTypes.string,
        caption: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            title: "",
            range: [defaultRange, defaultRange],
            box: [defaultBoxSize, defaultBoxSize],
            backgroundImage: defaultBackgroundImage,
            labels: [],
            alt: "",
            caption: ""
        };
    },

    render: function() {
        var image;
        var alt;
        var backgroundImage = this.props.backgroundImage;
        if (backgroundImage.url) {
            image = <SvgImage src={backgroundImage.url}
                              alt={
                                  /* alt text is formatted in a sr-only
                                     div next to the image, so we make
                                     this empty here.
                                     If there is no alt text at all,
                                     we don't put an alt attribute on
                                     the image, so that screen readers
                                     know there's something they can't
                                     read there :(.
                                     NOTE: React <=0.13 (maybe later)
                                     has a bug where it won't ever
                                     remove an attribute, so if this
                                     alt node is ever defined it's
                                     not removed. This is sort of
                                     dangerous, but we usually re-key
                                     new renderers so that they're
                                     rendered from scratch anyways,
                                     so this shouldn't be a problem
                                     in practice right now, although
                                     it will exhibit weird behaviour
                                     while editing. */
                                  this.props.alt ? "" : undefined
                              }
                              width={backgroundImage.width}
                              height={backgroundImage.height} />;
        }

        if (this.props.alt) {
            alt = <span className="perseus-sr-only">
                <Renderer
                    content={this.props.alt}
                    apiOptions={this.props.apiOptions} />
            </span>;
        }

        var box = this.props.box;

        return <div className="perseus-image-widget">
            {this.props.title &&
                <div className="perseus-image-title">
                    <Renderer
                        content={this.props.title}
                        apiOptions={this.props.apiOptions} />
                </div>
            }
            <div
                    className="graphie-container"
                    style={{
                        width: box[0],
                        height: box[1]
                    }}>
                {image}
                {alt}
                <Graphie
                    ref="graphie"
                    box={this.props.box}
                    range={this.props.range}
                    options={_.pick(this.props, "box", "range", "labels")}
                    setup={this.setupGraphie}>
                </Graphie>
            </div>
            {this.props.caption &&
                <div className="perseus-image-caption">
                <Renderer content={this.props.caption} />
                </div>
            }
        </div>;
    },

    setupGraphie: function(graphie, options) {
        _.map(options.labels, function(label) {
            graphie.label(label.coordinates, label.content, label.alignment);
        });
    },

    getUserInput: function() {
        return null;
    },

    simpleValidate: function(rubric) {
        return ImageWidget.validate(this.getUserInput(), rubric);
    },

    focus: $.noop,

    statics: {
        displayMode: "block"
    }
});

_.extend(ImageWidget, {
    validate: function(state, rubric) {
        return {
            type: "points",
            earned: 0,
            total: 0,
            message: null
        };
    }
});

var ImageEditor = React.createClass({
    mixins: [Changeable, EditorJsonify],

    componentDidMount: function() {
        // defer this because it can call a change handler synchronously
        _.defer(() => {
            var url = this.props.backgroundImage.url;
            this.onUrlChange(url, true);
        });
    },

    getDefaultProps: function() {
        return {
            title: "",
            range: [defaultRange, defaultRange],
            box: [defaultBoxSize, defaultBoxSize],
            backgroundImage: defaultBackgroundImage,
            labels: [],
            alt: "",
            caption: "",
        };
    },

    render: function() {
        var imageSettings = <div className="image-settings">
            <div>Background image:</div>
            <div>
                <label>Url:{' '}
                    <BlurInput
                        value={this.props.backgroundImage.url || ''}
                        onChange={url => this.onUrlChange(url, false)} />
                    <InfoTip>
                        <p>Create an image in graphie, or use the "Add image"
                        function to create a background.</p>
                    </InfoTip>
                </label>
            </div>
            {this.props.backgroundImage.url && <div>
                <div>
                    <label>Graphie X range:{' '}
                        <RangeInput
                            value={this.props.range[0]}
                            onChange={_.partial(this.onRangeChange, 0)} />
                    </label>
                </div>
                <div>
                    <label>Graphie Y range:{' '}
                        <RangeInput
                            value={this.props.range[1]}
                            onChange={_.partial(this.onRangeChange, 1)} />
                    </label>
                </div>
                <div>
                    <label>
                        <div>
                            Alt text:
                            <InfoTip>
                                <p>
                                    Add alt text to the image.
                                    This is important for screenreaders.
                                    The content of this alt text will be
                                    formatted as markdown (tables, emphasis,
                                    etc. are supported).
                                </p>
                            </InfoTip>
                        </div>
                        <Editor
                            content={this.props.alt}
                            onChange={(props) => {
                                if (props.content != null) {
                                    this.change("alt", props.content);
                                }
                            }}
                            widgetEnabled={false} />
                    </label>
                </div>
            </div>}
        </div>;

        var graphSettings = <div className="graph-settings">
                <div className="add-label">
                    <button onClick={this.addLabel}>
                        {' '}Add a label{' '}
                    </button>
                </div>
                {this.props.labels.length > 0 &&
                <table className="label-settings">
                    <thead>
                    <tr>
                        <th>Coordinates</th>
                        <th>Content</th>
                        <th>Alignment</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.labels.map(this._renderRowForLabel)}
                    </tbody>
                </table>}
        </div>;

        return <div className="perseus-image-editor">
            <div>Title:</div>
            <Editor
                content={this.props.title}
                onChange={(props) => {
                    if (props.content != null) {
                        this.change("title", props.content);
                    }
                }}
                widgetEnabled={false} />
            {imageSettings}
            {graphSettings}
            <div>Caption:</div>
            <Editor
                content={this.props.caption}
                onChange={(props) => {
                    if (props.content != null) {
                        this.change("caption", props.content);
                    }
                }}
                widgetEnabled={false} />
        </div>;
    },

    _renderRowForLabel: function(label, i) {
        return <tr key={i}>
            <td>
                <RangeInput
                    value={label.coordinates}
                    onChange={this.onCoordinateChange.bind(this, i)} />
            </td>
            <td style={{verticalAlign: "bottom", width: "5px"}}>
                <input
                    type="text"
                    className="graph-settings-axis-label"
                    value={label.content}
                    onChange={this.onContentChange.bind(this, i)} />
            </td>
            <td>
                <select
                    className="perseus-widget-dropdown"
                    value={label.alignment}
                    onChange={this.onAlignmentChange.bind(this, i)}>
                    {alignments.map(function(alignment, i) {
                        return <option key={"" + i} value={alignment}>
                            {alignment}
                        </option>;
                    }, this)}
                </select>
            </td>
            <td>
                <a
                    href="#"
                    className="simple-button orange delete-label"
                    title="Remove this label"
                    onClick={this.removeLabel.bind(this, i)}>
                    <span className="icon-trash" />
                </a>
            </td>
        </tr>;
    },

    addLabel: function(e) {
        e.preventDefault();
        var labels = this.props.labels.slice();
        var label = blankLabel();
        labels.push(label);
        this.props.onChange({
            labels: labels,
        });
    },

    removeLabel: function(labelIndex, e) {
        e.preventDefault();
        var labels = _(this.props.labels).clone();
        labels.splice(labelIndex, 1);
        this.props.onChange({labels: labels});
    },

    onCoordinateChange: function(labelIndex, newCoordinates) {
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            coordinates: newCoordinates
        });
        this.props.onChange({labels: labels});
    },

    onContentChange: function(labelIndex, e) {
        var newContent = e.target.value;
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            content: newContent
        });
        this.props.onChange({labels: labels});
    },

    onAlignmentChange: function(labelIndex, e) {
        var newAlignment = e.target.value;
        var labels = this.props.labels.slice();
        labels[labelIndex] = _.extend({}, labels[labelIndex], {
            alignment: newAlignment
        });
        this.props.onChange({labels: labels});
    },

    setUrl: function(url, width, height, silent) {
        // Because this calls into WidgetEditor._handleWidgetChange, which
        // checks for this widget's ref to serialize it.
        //
        // Errors if you switch items before the `Image` from `onUrlChange`
        // loads.
        if (!this.isMounted()) {
            return;
        }

        var image = _.clone(this.props.backgroundImage);
        image.url = url;
        image.width = width;
        image.height = height;
        var box = [image.width, image.height];
        this.props.onChange({
                backgroundImage: image,
                box: box,
            },
            null,
            silent
        );
    },

    // silently update the url when the component mounts
    // silently update sizes when the image loads
    // noisily update the url in response to the author changing it
    onUrlChange: function(url, silent) {
        // Immediately set the url, then set the image width and height
        // (silently) later when the image loads.

        var width = 0;
        var height = 0;

        if (url) {
            Util.getImageSize(url, (width, height) => {
                this.setUrl(url, width, height, true);
            });
        }

        this.setUrl(url, width, height, silent);
    },

    onRangeChange: function(type, newRange) {
        var range = this.props.range.slice();
        range[type] = newRange;
        this.props.onChange({range: range});
    },

    getSaveWarnings: function() {
        var warnings = [];

        if (this.props.backgroundImage.url && !this.props.alt) {
            warnings.push("No alt text");
        }

        return warnings;
    },
});

module.exports = {
    name: "image",
    // This widget's accessibility depends on its contents: if the image has
    // has a background but no alt text, it is not accessible
    accessible: (props) => {
        var bgImage = props.backgroundImage;
        return !(bgImage && bgImage.url && !props.alt);
    },
    displayName: "Image",
    widget: ImageWidget,
    editor: ImageEditor
};
